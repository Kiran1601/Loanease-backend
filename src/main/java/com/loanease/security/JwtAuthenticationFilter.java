package com.loanease.security;


import com.loanease.service.CustomUserDetailsService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils; // // Inject JwtUtils to validate and parse JWT tokens

    @Autowired // Inject your CustomUserDetailsService
    private CustomUserDetailsService customUserDetailsService;

    // The core filtering method that intercepts every HTTP request once
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException, java.io.IOException {
        String header = request.getHeader("Authorization");
        if(StringUtils.hasText(header) && header.startsWith("Bearer")) { // Use StringUtils.hasText
            String token = header.substring(7);
            try {
                Claims claims = jwtUtils.validateToken(token);
                String email = claims.getSubject();

                if (StringUtils.hasText(email) && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Load user details from your database using the email from the token
                    UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

                    // Create an authentication object with the loaded user details and authorities
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e){
                logger.error("Invalid JWT or failed to set authentication", e);
                // Optionally clear context here if you want to explicitly invalidate
                // SecurityContextHolder.clearContext();
            }
        }
        filterChain.doFilter(request,response);
    }
}
