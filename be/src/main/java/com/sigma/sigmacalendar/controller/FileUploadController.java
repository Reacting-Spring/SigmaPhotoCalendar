package com.sigma.sigmacalendar.controller;

import java.io.File;
import java.nio.file.Paths;
import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import com.sigma.sigmacalendar.security.JwtUtil;

import java.io.IOException;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class FileUploadController {
    
    private static final String BASE_DIR = System.getProperty("user.dir") + File.separator + "uploads";

    private final JwtUtil jwtUtil;

    public FileUploadController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

        @PostMapping("/upload")
    public ResponseEntity<?> upload(HttpServletRequest request, @RequestParam("file") MultipartFile file) throws IOException {
        try {
            String username = jwtUtil.extractUsername(jwtUtil.getRefreshTokenFromCookies(request));

            if (username == null) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }

            String today = LocalDate.now().toString();

            String userDir = BASE_DIR + File.separator + username + File.separator + today;
            System.out.println(userDir);
            
            File uploadDir = new File(userDir);
            
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String filePath = Paths.get(userDir, file.getOriginalFilename()).toString();
            File destFile = new File(filePath);

            file.transferTo(destFile);

            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(request.getRequestURL().toString());
            return ResponseEntity.ok("업로드 성공!");
            
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("파일 업로드 중 오류가 발생했습니다.");
        }
    }
}