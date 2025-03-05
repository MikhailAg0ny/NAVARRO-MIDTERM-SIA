package com.navarro.google_integration.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Authentication authentication) {
        // If user is already authenticated, redirect to contacts page
        if (authentication != null && authentication.isAuthenticated()) {
            return "redirect:/contacts";
        }
        // Otherwise show the login page
        return "login";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
}