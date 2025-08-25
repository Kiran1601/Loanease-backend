package com.loanease.repository;

import com.loanease.model.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {

    List<LoanApplication> findByEmailIgnoreCase(String email);

    List<LoanApplication> findByStatusIgnoreCase(String status);

    boolean existsById(Long id);
}
