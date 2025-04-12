package com.sigma.service;

import com.sigma.config.CustomUserDetails;
import com.sigma.config.JwtTokenProvider;
import com.sigma.db.entity.User;
import com.sigma.db.repository.UserRepository;
import com.sigma.exception.CustomException;
import com.sigma.exception.ErrorCode;
import com.sigma.request.AuthRequest;
import com.sigma.request.RegisterRequest;
import com.sigma.response.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByUserId(request.getUserId())) {
            throw new CustomException(ErrorCode.DUPLICATED_ID);
        }

        User user = User.builder()
            .userId(request.getUserId())
            .password(passwordEncoder.encode(request.getPassword()))
            .build();
        userRepository.save(user);
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUserId(request.getUserId())
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        ResponseCookie cookie = jwtTokenProvider.createRefreshTokenCookie(refreshToken);
        return new AuthResponse(accessToken, cookie);
    }

    @Override
    public ResponseCookie logout() {
        return jwtTokenProvider.deleteRefreshTokenCookie();
    }

    @Override
    public String reissueAccessToken(String refreshToken) {
        if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        Long id = jwtTokenProvider.getIdFromToken(refreshToken);
        return jwtTokenProvider.generateAccessToken(id);
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        return new CustomUserDetails(user);
    }
}
