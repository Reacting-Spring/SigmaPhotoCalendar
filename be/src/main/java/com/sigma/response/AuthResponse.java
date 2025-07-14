package com.sigma.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.ResponseCookie;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private ResponseCookie cookie;
}