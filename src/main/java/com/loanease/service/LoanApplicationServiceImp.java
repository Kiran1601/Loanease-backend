package com.loanease.service;

import com.loanease.model.LoanApplication;
import com.loanease.model.LoanStatusHistory;

import java.util.List;

public interface LoanApplicationServiceImp {
    LoanApplication submitApplication(LoanApplication application);
    List<LoanApplication> getApplicationsByStatus(String status);
    List<LoanApplication> getApplicationsByEmail(String email);
    LoanApplication updateStatus(Long id, String newStatus, String changedBy);
    LoanApplication getById(Long id);
    void deleteApplication(Long id);
    List<LoanApplication> getAllApplications();
    List<LoanStatusHistory> getStatusHistoryByApplicationId(Long applicationId);
    List<LoanStatusHistory> getAllStatusHistory();
}
