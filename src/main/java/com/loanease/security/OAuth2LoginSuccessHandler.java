package com.loanease.security;

import com.loanease.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtUtils jwtUtil; // Your JWT generator
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        // Get the CustomOAuth2User you returned earlier
        CustomOAuth2User oauthUser = (CustomOAuth2User) authentication.getPrincipal();

        // Directly get your DB user (no more findByEmail!)
        User user = oauthUser.getUser();
        System.out.println("DEBUG: User from CustomOAuth2User => " + user.getEmail());
        System.out.println("DEBUG: User ID => " + user.getId());

        // 🔐 Generate JWT token
        String jwtToken = jwtUtil.generateToken(user); // You must implement this method

        // 🌐 Redirect to frontend with token
        String redirectUrl = "http://localhost:3000/dashboard?token=" + jwtToken;

        response.sendRedirect(redirectUrl);
    }
}
