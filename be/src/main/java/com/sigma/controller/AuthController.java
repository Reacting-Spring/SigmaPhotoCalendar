package com.sigma.controller;

import com.sigma.config.JwtTokenProvider;
import com.sigma.request.AuthRequest;
import com.sigma.request.RegisterRequest;
import com.sigma.response.AuthResponse;
import com.sigma.response.LoginRes;
import com.sigma.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) {

        userService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid AuthRequest request) {

        AuthResponse response = userService.login(request);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, response.getCookie().toString())
            .body(new LoginRes(response.getAccessToken()));
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(name = "refresh_token") String refreshToken) {
        ResponseCookie deleteCookie = userService.logout(refreshToken);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, deleteCookie.toString()).build();
    }

    // 토큰 재발급
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
        @CookieValue(name = "refresh_token") String refreshToken) {
        String newAccessToken = userService.reissueAccessToken(refreshToken);
        return ResponseEntity.ok(new LoginRes(newAccessToken));
    }

}
