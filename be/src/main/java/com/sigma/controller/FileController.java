package com.sigma.controller;

import com.sigma.service.FileService;
import com.sigma.utils.FileUtils;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    // 이미지 업로드
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@AuthenticationPrincipal Long userId,
        @Valid @RequestParam("images") List<MultipartFile> images, @Valid @RequestParam("date") LocalDate date) {
        fileService.saveImage(userId, images, date);
        return ResponseEntity.ok().build();
    }

    // 특정 날짜 이미지 목록 조회
    @GetMapping("/images")
    public ResponseEntity<List<String>> getImagePathsByDate(@AuthenticationPrincipal Long userId,
        @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<String> imagePaths = fileService.getImagePathsByDate(userId, date);
        return ResponseEntity.ok(imagePaths);
    }

    // 이미지 삭제
    @DeleteMapping("/images")
    public ResponseEntity<Void> deleteImages(
        @AuthenticationPrincipal Long userId,
        @RequestBody List<String> filenames
    ) {
        fileService.deleteImages(userId, filenames);
        return ResponseEntity.noContent().build();
    }

}
