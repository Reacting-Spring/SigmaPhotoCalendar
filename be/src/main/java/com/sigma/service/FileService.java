package com.sigma.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {

    void saveImage(Long userId, MultipartFile image, LocalDate date);

    List<String> getImagePathsByDate(Long userId, LocalDate date);

	void deleteImages(Long userId, List<String> filenames);
}
