package com.sweatsheet.server.auth;

import com.sweatsheet.server.jwt.JwtUtil;
import com.sweatsheet.server.user.User;
import com.sweatsheet.server.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {

        // Step 1 - Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Step 2 - Build and save new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        // Step 3 - Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail());

        // Step 4 - Return response
        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .message("Registration successful")
                .build();
    }

    public AuthResponse login(LoginRequest request) {

        // Step 1 - Authenticate email and password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Step 2 - Load user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Step 3 - Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail());

        // Step 4 - Return response
        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .message("Login successful")
                .build();
    }
}