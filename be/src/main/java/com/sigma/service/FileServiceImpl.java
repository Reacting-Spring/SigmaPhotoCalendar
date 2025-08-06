package com.sigma.service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

import com.sigma.db.entity.Image;
import com.sigma.db.repository.ImageRepository;
import com.sigma.db.repository.UserRepository;
import com.sigma.exception.CustomException;
import com.sigma.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
    public void saveImage(Long userId, List<MultipartFile> images, LocalDate date) {

        String year = String.valueOf(date.getYear());
        String month = String.format("%02d", date.getMonthValue());
        String day = String.format("%02d", date.getDayOfMonth());

        // 연/월/일 폴더 경로
        String folderPath = String.format("%s/%s/%s/%s",
            uploadDir, year, month, day);

        File folder = new File(folderPath);
        if (!folder.exists()) {
            folder.mkdirs(); // 중간 폴더까지 전부 생성
        }

		for (MultipartFile image : images) {
			if (image.isEmpty())
				continue; // 빈 파일 처리

			String originalFilename = image.getOriginalFilename();
			String ext = "";

			if (originalFilename != null && originalFilename.contains(".")) {
				ext = originalFilename.substring(originalFilename.lastIndexOf("."));
			}

			String uuidName = UUID.randomUUID().toString() + ext;
			String fullPath = folderPath + "/" + uuidName;

			try {
				image.transferTo(new File(fullPath));
			} catch (IOException e) {
				throw new CustomException(ErrorCode.FILE_UPLOAD_FAIL);
			}

			imageRepository.save(Image.builder()
				.user(userRepository.getReferenceById(userId))
				.filename(uuidName)
				.folderPath(String.format("%s/%s/%s", year, month, day))
				.createdAt(date)
				.build());
		}
	}

    @Override
    public List<String> getImagePathsByDate(Long userId, LocalDate date) {
        List<Image> images = imageRepository.findAllByUserIdAndCreatedAt(userId, date);

        return images.stream()
            .map(img -> "/" + img.getFolderPath() + "/" + img.getFilename())
            .toList();
    }

    @Override
    @Transactional
    public void deleteImages(Long userId, List<String> filenames) {
        List<String> pathsToDelete = new ArrayList<>();

        for (String filename : filenames) {
            Image image = imageRepository.findByUserIdAndFilename(userId, filename)
                .orElseThrow(() -> new CustomException(ErrorCode.FILE_NOT_FOUND));

            // 삭제할 파일 경로 기억
            String fullPath = uploadDir + File.separator + image.getFolderPath() + File.separator + image.getFilename();
            pathsToDelete.add(fullPath);

            // DB만 먼저 삭제 예약
            imageRepository.delete(image);
        }

        // 트랜잭션 커밋 성공 시에만 실제 파일 삭제
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                for (String path : pathsToDelete) {
                    File file = new File(path);
                    if (file.exists() && !file.delete()) {
                        throw new CustomException(ErrorCode.FILE_DELETE_FAIL);
                    }
                }
            }
        });
    }

}
