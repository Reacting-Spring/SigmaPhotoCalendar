package com.sigma.service;

import com.sigma.db.entity.Image;
import com.sigma.db.repository.ImageRepository;
import com.sigma.db.repository.UserRepository;
import com.sigma.exception.CustomException;
import com.sigma.exception.ErrorCode;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final ImageRepository imageRepository;
    private final UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Transactional
    @Override
    public void saveImage(Long userId, MultipartFile image) {

        String uuidName = UUID.randomUUID() + image.getOriginalFilename();
        String fullPath = uploadDir + "/" + uuidName;

        try {
            image.transferTo(new File(fullPath));
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FILE_UPLOAD_FAIL);
        }

        imageRepository.save(Image.builder()
            .user(userRepository.getReferenceById(userId))
            .filename(uuidName)
            .createdAt(LocalDate.now())
            .build());
    }

    @Override
    public List<String> getImagePathsByDate(Long userId, LocalDate date) {
        List<Image> images = imageRepository.findAllByUserIdAndCreatedAt(userId, date);

        return images.stream()
            .map(Image::getFilename)
            .toList();
    }

    @Override
    public byte[] loadImageByFilename(String filename) {
        File file = new File(uploadDir + File.separator + filename);

        if (!file.exists() || !file.isFile()) {
            throw new CustomException(ErrorCode.FILE_NOT_FOUND);
        }

        try {
            return Files.readAllBytes(file.toPath());
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FILE_READ_FAIL);
        }
    }
}
