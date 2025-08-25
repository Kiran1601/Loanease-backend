package com.loanease.repository;

import com.loanease.model.LoanStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanStatusHistoryRepository extends JpaRepository<LoanStatusHistory, Long> {
    List<LoanStatusHistory> findByApplicationId(Long applicationId);
}
