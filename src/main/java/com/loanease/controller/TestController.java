package com.loanease.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public String Hello(){
        return" LoanEase API is up! ";

    }
}
