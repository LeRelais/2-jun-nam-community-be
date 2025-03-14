document.addEventListener('DOMContentLoaded', async () => {
    const elements = getDomElements();
    const userInfo = await fetchUserInfo();
    initializeUserProfile(userInfo, elements);
    setupProfilePictureChange(elements);
    setupModifyNicknameHandler(userInfo, elements);
    setupAccountDeletionHandler(elements);
    setupDropdownMenu(elements);
    setupProfileEdit(userInfo, elements.editProfile);
    setupPasswordEdit(userInfo, elements.changePassword);
    setupLogout(elements.logout);
});

function getDomElements() {
    return {
        changeProfilePicBtn: document.getElementById('changeProfilePicBtn'),
        profilePicInput: document.getElementById('profilePicInput'),
        profileImage: document.getElementById('profileImage'),
        nickname: document.getElementById('nickname'),
        email: document.getElementById('email'),
        modifyButton: document.getElementById('modify-button'),
        modifyComplete: document.getElementById('modify-complete'),
        deleteAccountModalOverlay: document.getElementById('deleteAccountModalOverlay'),
        deleteAccount: document.getElementById('delete-account'),
        deleteAccountCancelButton: document.getElementById('deleteAccountCancelButton'),
        deleteAccountConfirmButton: document.getElementById('deleteAccountConfirmButton'),
        dropdown: document.getElementById("dropdown"),
        editProfile: document.getElementById("editProfile"),
        profileIcon: document.getElementById("profile-icon"),
        changePassword: document.getElementById("changePassword"),
        logout: document.getElementById("logout"),
        nicknameError: document.getElementById('nick-error-message')
    };
}

async function fetchUserInfo() {
    return await (await fetch("/auth/me")).json();
}

function initializeUserProfile(userInfo, { email, nickname }) {
    email.innerHTML = userInfo.email;
    nickname.value = userInfo.nickname;
}

function setupProfilePictureChange({ changeProfilePicBtn, profilePicInput, profileImage }) {
    changeProfilePicBtn.addEventListener('click', (e) => {
        e.preventDefault();
        profilePicInput.click();
    });

    profilePicInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => profileImage.src = e.target.result;
            reader.readAsDataURL(file);
        }
    });
}

function setupModifyNicknameHandler(userInfo, { modifyButton, nickname, nicknameError }) {
    modifyButton.addEventListener('click', async (e) => {
        e.preventDefault();
        if (nickname.value.length >= 11) {
            nicknameError.innerText = "*닉네임은 최대 10자 까지 작성 가능합니다";
            return;
        } else {
            nicknameError.innerHTML = '&nbsp;';
        }
        try {
            await modifyUserNickname(userInfo.id, nickname.value, userInfo.password);
            location.href = '/index';
        } catch (error) {
            console.error('유저 닉네임 수정 실패:', error);
        }
    });
}

async function modifyUserNickname(userId, newNickname, password) {
    const response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: newNickname, password })
    });
    if (!response.ok) throw new Error('유저 닉네임 수정 실패');
}

function setupAccountDeletionHandler({ deleteAccount, deleteAccountModalOverlay, deleteAccountCancelButton, deleteAccountConfirmButton }) {
    deleteAccount.addEventListener('click', (e) => {
        e.preventDefault();
        deleteAccountModalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    deleteAccountCancelButton.addEventListener('click', () => {
        closeModal(deleteAccountModalOverlay);
    });

    deleteAccountConfirmButton.addEventListener('click', () => {
        closeModal(deleteAccountModalOverlay);
        window.location.href = 'login.html';
    });
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function setupDropdownMenu({ profileIcon, dropdown }) {
    profileIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });
    window.addEventListener('click', () => dropdown.classList.remove('show'));
}


function setupProfileEdit(userInfo, editProfile){
    editProfile.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(userInfo.id + ' ' + editProfile);
      location.href = `/users/${userInfo.id}/edit`;
  });
  }
  
  function setupPasswordEdit(userInfo, changePassword){
    changePassword.addEventListener("click", (e) => {
      e.preventDefault();
      location.href = `/users/${userInfo.id}/password`;
  });
  }
  
  async function setupLogout(logout){
    logout.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const response = await fetch("/auth/logout", { method: "POST" });
  
        if (response.ok) {
            alert("로그아웃 되었습니다.");
            location.href = "/"; // 로그인 페이지로 이동
        } else {
            alert("로그아웃에 실패했습니다.");
        }
    } catch (error) {
        console.error("❌ 로그아웃 중 오류 발생:", error);
    }
  });
  }
  