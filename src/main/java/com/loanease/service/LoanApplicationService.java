package com.loanease.service;

import com.loanease.exception.LoanApplicationNotFoundException;
import com.loanease.model.LoanApplication;
import com.loanease.model.LoanDocument;
import com.loanease.model.LoanStatusHistory;
import com.loanease.repository.LoanApplicationRepository;
import com.loanease.repository.LoanDocumentRepository;
import com.loanease.repository.LoanStatusHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoanApplicationService implements LoanApplicationServiceImp {

    @Autowired
    private LoanApplicationRepository loanApplicationRepository;

    @Autowired
    private LoanStatusHistoryRepository loanStatusHistoryRepository;

    @Autowired
    private LoanDocumentRepository loanDocumentRepository;

    @Override
    public LoanApplication submitApplication(LoanApplication application) {
        application.setApplicationDate(LocalDate.now());
        application.setStatus("PENDING");
        return loanApplicationRepository.save(application);
    }

    @Override
    public List<LoanApplication> getApplicationsByStatus(String status) {
        return loanApplicationRepository.findByStatusIgnoreCase(status);
    }

    @Override
    public List<LoanApplication> getApplicationsByEmail(String email) {
        return loanApplicationRepository.findByEmailIgnoreCase(email);
    }


    @Override
    public LoanApplication updateStatus(Long id, String newStatus, String changedBy) {
        LoanApplication application = loanApplicationRepository.findById(id)
                .orElseThrow(() -> new LoanApplicationNotFoundException("Application not found for ID: " + id));
        String oldStatus = application.getStatus();
        application.setStatus(newStatus.toUpperCase());

        loanApplicationRepository.save(application);

        //Save status change history
        LoanStatusHistory history = new LoanStatusHistory(
                application.getId(),
                oldStatus,
                newStatus.toUpperCase(),
                changedBy,
                LocalDateTime.now()

        );

        loanStatusHistoryRepository.save(history);
        return loanApplicationRepository.save(application);
    }



    @Override
    public LoanApplication getById(Long id) {
        return loanApplicationRepository.findById(id)
                .orElseThrow(() -> new LoanApplicationNotFoundException("Application with ID " + id + " not found"));

    }

    @Override
    public void deleteApplication(Long id) {
        if (!loanApplicationRepository.existsById(id)) {
            throw new LoanApplicationNotFoundException("Application with ID " + id + " not found");
        }
        loanApplicationRepository.deleteById(id);
    }

    @Override
    public List<LoanApplication> getAllApplications() {

        return loanApplicationRepository.findAll();
    }

    @Override
    public List<LoanStatusHistory> getStatusHistoryByApplicationId(Long applicationId) {
        return loanStatusHistoryRepository.findByApplicationId(applicationId);
    }
    @Override
    public List<LoanStatusHistory> getAllStatusHistory() {

        return loanStatusHistoryRepository.findAll();
    }

    @Override
    public LoanDocument uploadDocument(Long applicationId, MultipartFile file) throws IOException {
        LoanApplication application = loanApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Loan Application not found"));

        // ✅ Step 1: Define allowed types
        List<String> allowedTypes = List.of(
                "application/pdf",
                "image/png",
                "image/jpeg",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );

        // ✅ Step 2: Validate
        if (!allowedTypes.contains(file.getContentType())) {
            throw new IllegalArgumentException("Invalid file type: " + file.getContentType());
        }

        // ✅ Step 3: Save document
        LoanDocument document = new LoanDocument();
        document.setFileName(file.getOriginalFilename());
        document.setFileType(file.getContentType());
        document.setFileSize(file.getSize());
        document.setData(file.getBytes());
        document.setLoanApplication(application);

        return loanDocumentRepository.save(document);
    }

    @Override
    public List<LoanDocument> getDocumentsByApplicationId(Long applicationId) {
        LoanApplication application = loanApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Loan Application not found"));
        return loanDocumentRepository.findByLoanApplication(application);
    }

    @Override
    public LoanDocument getDocumentById(Long docId) {
        return loanDocumentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + docId));
    }



}
