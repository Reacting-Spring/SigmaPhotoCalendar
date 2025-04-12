package com.sigma.utils;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

@Component
public class FileUtils {

    public static MediaType getMediaType(String filename) {
        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();

        return switch (ext) {
            case "png" -> MediaType.IMAGE_PNG;
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
            case "gif" -> MediaType.IMAGE_GIF;
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }

}
