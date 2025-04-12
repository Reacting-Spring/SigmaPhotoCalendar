package com.sigma.controller;

import com.sigma.service.FileService;
import com.sigma.utils.FileUtils;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
        @RequestParam("image") MultipartFile image) {
        fileService.saveImage(userId, image);
        return ResponseEntity.ok().build();
    }

    // 특정 날짜 이미지 목록 조회
    @GetMapping("/images")
    public ResponseEntity<List<String>> getImagePathsByDate(@AuthenticationPrincipal Long userId,
        @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<String> imagePaths = fileService.getImagePathsByDate(userId, date);
        return ResponseEntity.ok(imagePaths);
    }

    // 특정 이미지 불러오기
    @GetMapping("/image")
    public ResponseEntity<byte[]> getImage(@RequestParam String filename) {
        byte[] imageData = fileService.loadImageByFilename(filename);
        MediaType mediaType = FileUtils.getMediaType(filename);

        return ResponseEntity
            .ok()
            .contentType(mediaType)
            .body(imageData);
    }

}
