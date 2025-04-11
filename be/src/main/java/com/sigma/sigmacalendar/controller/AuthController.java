package com.sigma.sigmacalendar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseCookie;

import com.sigma.sigmacalendar.request.LoginPostReq;
import com.sigma.sigmacalendar.request.SignupPostReq;
import com.sigma.sigmacalendar.service.UserService;
import com.sigma.sigmacalendar.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Validated @RequestBody SignupPostReq request) {
        log.info("request: {}", request);
        userService.signup(request);
        return ResponseEntity.ok("회원가입 성공!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Validated @RequestBody LoginPostReq request, HttpServletResponse response) {
        userService.login(request);
        String username = request.getUserId();
        String accessToken = jwtUtil.generateToken(username);
        String refreshToken = jwtUtil.generateRefreshToken(username);

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .path("/")
                .maxAge(60 * 60 * 24 * 7) // 7일
                .sameSite("Strict")
                .build();
        
        response.addHeader("Set-Cookie", refreshCookie.toString());

        Map<String, String> tokens = new HashMap<>();
        tokens.put("access_token", accessToken);

        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = jwtUtil.getRefreshTokenFromCookies(request);

        if (refreshToken == null || !jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body("Refresh Token이 유효하지 않습니다.");
        }

        String username = jwtUtil.extractUsername(refreshToken);
        String newAccessToken = jwtUtil.generateToken(username);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("access_token", newAccessToken);

        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", null)
        .httpOnly(true)
        .sameSite("Strict")
        .path("/")
        .maxAge(0)
        .build();

    response.addHeader("Set-Cookie", refreshCookie.toString());

        return ResponseEntity.ok("로그아웃 성공!");
    }
}