package com.loanease;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class LoanOriginationApplication {
    public static void main(String[] args) {

        SpringApplication.run(LoanOriginationApplication.class, args);
    }
}
