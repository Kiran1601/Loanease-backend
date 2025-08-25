package com.loanease.controller;

import com.loanease.exception.LoanApplicationNotFoundException;
import com.loanease.model.LoanApplication;
import com.loanease.model.LoanStatusHistory;
import com.loanease.service.LoanApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/loans")
public class LoanApplicationController {

    @Autowired
    private LoanApplicationService service;

    @PostMapping("/add")
    public ResponseEntity<LoanApplication> applyLoan (@RequestBody LoanApplication application){
        service.submitApplication(application);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<LoanApplication>> getByStatus(@PathVariable String status){
        List<LoanApplication> list = service.getApplicationsByStatus(status);
        return ResponseEntity.ok(list);
    }

 /*   @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/applicant/{email}")
    public ResponseEntity<List<LoanApplication>> getByEmail(@PathVariable String email){
        List<LoanApplication> list = service.getApplicationsByEmail(email);
        return ResponseEntity.ok(list);
    }

  */

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/applicant/{email}")
    public ResponseEntity<?> getApplicationsByEmail(@PathVariable String email, Authentication authentication) {
        String userEmail = authentication.getName();

        // Security check to ensure a user can only view their own applications
        if (!authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
                !email.equalsIgnoreCase(userEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to view this user's applications.");
        }
        try {
            List<LoanApplication> applications = service.getApplicationsByEmail(email);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving applications: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<LoanApplication> getApplicationById(@PathVariable Long id) {
        LoanApplication application = service.getById(id);
        return ResponseEntity.ok(application);
    }

    // Update application status
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status, Authentication authentication) {
        String adminEmail = authentication.getName();
        // Validate status values
        if (!List.of("PENDING", "APPROVED", "REJECTED").contains(status.toUpperCase())) {
            return ResponseEntity.badRequest().body("Invalid status value. Allowed: PENDING, APPROVED, REJECTED.");
        }

        try {
            LoanApplication updatedApp = service.updateStatus(id, status.toUpperCase(),adminEmail);
            return ResponseEntity.ok(updatedApp);
        } catch (LoanApplicationNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteApplication(@PathVariable Long id) {
        service.deleteApplication(id);
        return ResponseEntity.ok("Loan application deleted successfully.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAll")
    public List<LoanApplication> getAllApplications(){

        return service.getAllApplications();
    }

    //History of Change of status
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/my-status-history/{applicationId}")
    public ResponseEntity<?> getMyStatusHistory(@PathVariable Long applicationId, Authentication authentication) {
        String userEmail = authentication.getName();
        try {
            // Find the application by ID
            LoanApplication application = service.getById(applicationId);
            // Check if the user is an ADMIN or if the application belongs to the logged-in USER
            if (!authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
                    !application.getEmail().equalsIgnoreCase(userEmail)) {
                // If not an admin and not the owner, deny access
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to view this application's status history.");
            }
            // Get the status history for the application
            List<LoanStatusHistory> history = service.getStatusHistoryByApplicationId(applicationId);
            return ResponseEntity.ok(history);
        } catch (LoanApplicationNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAllStatusHistory")
    public ResponseEntity<List<LoanStatusHistory>> getAllStatusHistory() {
        List<LoanStatusHistory> history = service.getAllStatusHistory();
        return ResponseEntity.ok(history);
    }


}


