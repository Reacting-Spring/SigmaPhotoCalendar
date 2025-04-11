package com.sigma.sigmacalendar.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sigma.sigmacalendar.model.User;
import com.sigma.sigmacalendar.repository.UserRepository;
import com.sigma.sigmacalendar.request.SignupPostReq;
import com.sigma.sigmacalendar.request.LoginPostReq;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void signup(SignupPostReq request) {
        if (userRepository.findByUserId(request.getUserId()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 사용자입니다.");
        }
        User user = new User(request.getUserId(), passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }
    
    public void login(LoginPostReq request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
    }
    
}
