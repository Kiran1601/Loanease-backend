package com.loanease.service;

import com.loanease.exception.LoanApplicationNotFoundException;
import com.loanease.model.LoanApplication;
import com.loanease.model.LoanStatusHistory;
import com.loanease.repository.LoanApplicationRepository;
import com.loanease.repository.LoanStatusHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoanApplicationService implements LoanApplicationServiceImp {

    @Autowired
    private LoanApplicationRepository loanApplicationRepository;

    @Autowired
    private LoanStatusHistoryRepository loanStatusHistoryRepository;

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


}
