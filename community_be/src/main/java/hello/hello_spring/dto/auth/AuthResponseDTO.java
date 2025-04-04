package hello.hello_spring.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponseDTO {
    private Long id;
    private String email;
    private String nickname;
    private String profileImage;
}