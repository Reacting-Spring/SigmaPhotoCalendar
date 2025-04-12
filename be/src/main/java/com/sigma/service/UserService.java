package com.sigma.service;

import com.sigma.request.AuthRequest;
import com.sigma.request.RegisterRequest;
import com.sigma.response.AuthResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseCookie;

public interface UserService {

    void register(@Valid RegisterRequest request);

    AuthResponse login(@Valid AuthRequest request);

    ResponseCookie logout();

    String reissueAccessToken(String refreshToken);
}
