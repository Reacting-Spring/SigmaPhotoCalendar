package com.sigma.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {

    void saveImage(Long userId, List<MultipartFile> images, LocalDate date);

    List<String> getImagePathsByDate(LocalDate date);

	void deleteImages(List<String> filenames);
}
