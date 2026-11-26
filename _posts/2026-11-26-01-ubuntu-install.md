---
title: "우분투 24.04 설치와 첫 세팅 (부팅 USB부터 한글 입력까지)"
description: "ISO 다운로드, 부팅 USB 제작, BIOS 설정, 설치 마법사 13개 화면을 화면 순서 그대로 따라갑니다."
date: 2026-11-26 09:01:00 +0900
series: robot-setup
order: 1
---

로봇 공부를 시작하기로 마음먹었다면, 가장 먼저 손에 쥐는 것이 **설치 USB**입니다. 이 글은 빈 노트북에서 시작해 **Ubuntu 24.04 LTS Desktop**이 설치되고, 터미널·한글 입력·브라우저까지 쓸 수 있는 상태가 되기까지를 **화면에 보이는 그대로** 순서대로 다룹니다.

중간에 한 번이라도 순서를 건너뛰면 "부팅이 안 된다", "설치 중에 멈춘다" 같은 문제가 생깁니다. 그래서 이번 글은 **"어떤 화면에서, 무엇을 누르고, 왜 그걸 고르는지"**를 한 단계씩 적었습니다. 막히면 해당 절의 *자주 막히는 지점*만 펴서 보세요.

**3줄 요약**

1. 8GB 이상 USB에 `ubuntu-24.04.x-desktop-amd64.iso`를 굽는다 (Etcher: 파일 → USB → Flash!).
2. USB로 부팅해 **Try or Install Ubuntu** → `Install Ubuntu` → Interactive → Extended → Erase disk → 계정 → Install.
3. 설치가 끝나면 **Restart Now → USB를 뽑고 Enter** → 업데이트 → Terminator → 한글 입력 → Chrome.

## 이 글에서 다루는 것

- ISO 이미지의 개념과 내려받는 위치, **부팅 USB를 만드는 세 가지 방법**(Etcher / Rufus / Disks)
- BIOS/UEFI 진입, **제조사별 부트 메뉴 키**, Secure Boot
- Ubuntu 24.04 설치 마법사의 **화면 13개를 하나씩** — 각 화면에서 무엇을 고르고 왜 그런지
- 설치가 끝난 뒤의 첫 세팅: 업데이트, 터미널, Terminator, 한글 입력, Chrome
- 자주 막히는 지점과 해결 방법, 설치 완료 체크리스트

> ⚠️ **시작 전 반드시**: 설치 방식에 따라 디스크가 전부 지워질 수 있습니다. 기존 윈도우에 중요한 파일이 있다면 외장 디스크나 클라우드에 **백업**해 두세요. 이 단계만 지키면 아래 과정은 언제든 되돌릴 수 있습니다.
>
> 설치에 걸리는 시간은 **USB 만들기 10~20분 + 설치 20~40분 + 첫 세팅 20분** 정도입니다. 노트북이 오래되었거나 인터넷이 느리면 두 배까지 잡으세요.

---

## 1. 큰 그림: 설치 흐름

```text
ISO 다운로드 → 부팅 USB 제작 → USB로 부팅 → 설치 마법사 → 재부팅
      → 시스템 업데이트 → 터미널/Terminator → 한글 입력 → Chrome
```

![우분투 24.04 설치 전체 흐름 — ISO 다운로드부터 첫 세팅 확인까지 7단계](https://velog.velcdn.com/images/aiexcelh/post/69b60a9c-536f-47c3-9bd4-4dc30a3057dd/image.png)

*1 → 7 순서를 그대로 따라가면 됩니다. 5~7단계는 설치가 끝난 뒤의 첫 세팅입니다.*

각 단계는 "왜 필요한가"가 다릅니다.

| 단계 | 왜 필요한가 |
| --- | --- |
| ISO 다운로드 | 운영체제 전체가 담긴 디스크 이미지 파일 |
| 부팅 USB 제작 | PC가 USB에서 직접 부팅해 설치 프로그램을 실행하게 함 |
| BIOS/UEFI 설정 | 부팅 순서를 USB로 바꿔야 설치 프로그램이 뜸 |
| 설치 마법사 | 디스크에 실제로 설치, 사용자 계정 생성 |
| 업데이트 | 설치 직후의 보안 패치·드라이버 반영 |
| 개발 도구 | 터미널 분할, 한글, 브라우저 등 작업 환경 구성 |

### 지금 내 PC 상태별로, 특히 조심할 곳

| 내 상황 | 특히 볼 곳 |
| --- | --- |
| 윈도우만 있는 노트북을 우분투 전용으로 | **4-9 디스크** (Erase disk — 윈도우가 지워집니다), 백업 |
| 윈도우를 남기고 듀얼부팅 | **4-9 디스크** (Install alongside), 윈도우의 **BitLocker 끄기**, 빠른 시작 끄기 |
| 우분투를 다시 설치(재설치) | **4-9 디스크**, 지울 파티션 확인, `/home` 백업 |
| NVIDIA 그래픽이 있는 노트북 | **4-8 서드파티 드라이버**, Secure Boot·MOK 화면(4-14) |
| USB 부팅 자체가 안 됨 | **3장** 부트 메뉴 키, Secure Boot |

### 준비물 체크리스트

- [ ] USB 메모리 **8GB 이상** (안의 내용은 모두 지워집니다)
- [ ] 설치할 PC — 디스크 여유 **25GB 이상**, 메모리 4GB 이상 권장
- [ ] 인터넷 (설치 중 업데이트·드라이버 다운로드용, 없어도 설치는 가능)
- [ ] 중요한 파일 **백업**
- [ ] 1~2시간의 여유

---

## 명령은 어디에 입력하나요?

이 글의 명령은 **설치가 끝난 우분투의 터미널**에서 입력합니다.

**여는 방법**

1. 바탕화면에서 `Ctrl` + `Alt` + `T`
2. 또는 왼쪽 아래 **앱 표시(점 여러 개)** → "Terminal" / "터미널" 검색

**입력하는 위치**: 창의 `$` 뒤에 명령을 입력하고 **`Enter`**. 이 글의 코드 블록에는 `$`를 넣지 않았으니, **블록 전체를 그대로 복사해 붙여넣으면** 됩니다.

| 자주 쓰는 단축키 | 뜻 |
| --- | --- |
| `Ctrl`+`Alt`+`T` | 새 터미널 창 |
| `Ctrl`+`Shift`+`T` | 터미널 **새 탭** |
| `Ctrl`+`Shift`+`W` | 탭 닫기 |
| `Ctrl`+`Shift`+`C` / `V` | 터미널에서 복사 / 붙여넣기 |
| `Ctrl`+`C` | 실행 중인 명령 중단 |

> 설치 마법사(4장)에서 입력하는 값은 터미널이 아니라 **마법사 화면의 입력 칸**입니다. 어디에 무엇을 넣는지 각 단계에 적어 두었습니다.

---

## 2. ISO 이미지와 부팅 USB

### 1) ISO가 뭔가요?

**ISO 이미지**는 운영체제 설치 파일 전체를 하나의 파일로 묶은 **디스크 이미지**입니다. 확장자가 `.iso`이고, 실제로는 "CD/DVD 한 장을 파일로 구운 것"에 가깝습니다. 우분투 데스크톱 ISO는 약 **6GB**입니다.

주의할 점은, ISO를 USB에 **그냥 복사하면 안 된다**는 것입니다. ISO 안에는 부팅에 필요한 부트로더와 파일 시스템 정보가 들어 있는데, 단순 복사로는 그 구조가 유지되지 않습니다. 그래서 **이미지 기록(굽기) 도구**가 필요합니다.

### 2) ISO 내려받기 — 버튼 순서대로

<https://ubuntu.com/download/desktop> 에 접속하면 **가장 최신 LTS**(지금은 26.04 LTS)가 먼저 보입니다. 우리가 필요한 것은 ROS 2 Jazzy의 기준인 **24.04 LTS**이므로, 다음 순서로 내려받습니다.

1. 페이지 맨 위의 **Ubuntu 24.04 LTS** 항목을 찾습니다. 화면에 없으면 아래쪽의 **"other versions of Ubuntu Desktop … alternative downloads"** 링크를 누릅니다.
2. **Ubuntu 24.04 LTS Noble Numbat** → **24.04.5**(24.04의 최신 포인트 릴리스)를 선택합니다.
3. **Intel or AMD 64-bit architecture** 의 **Download** 버튼을 누릅니다. (애플 실리콘처럼 ARM 기기라면 `arm64` 이미지를 받아야 합니다.)
4. `ubuntu-24.04.x-desktop-amd64.iso` 파일(약 6GB)이 **다운로드** 폴더에 저장됩니다.
5. 파일 크기가 대략 6GB인지 확인합니다. 1GB도 안 되면 다운로드가 중간에 끊긴 것이니 다시 받으세요.

> 💡 `24.04.5`의 `.5`는 24.04의 **포인트 릴리스**(버그·드라이버 수정이 반영된 새 이미지) 번호입니다. `amd64`는 인텔/AMD 64비트용이라는 뜻입니다.
>
> 💡 파일이 제대로 받아졌는지 숫자로 확인하려면(선택), 터미널에서 아래를 실행해 나온 값이 우분투 릴리스 페이지의 `SHA256SUMS` 값과 같은지 봅니다. 다르면 다시 받으세요.

```bash
sha256sum ~/Downloads/ubuntu-24.04.5-desktop-amd64.iso
```

> ❗ **흔한 실수**: 다운로드 페이지의 최신 LTS(26.04)를 그냥 받는 것. 이 글과 다음 글(ROS 2 Jazzy)은 **24.04 기준**이므로, 26.04를 설치하면 4편의 ROS 2 설치 명령이 그대로 동작하지 않습니다.

### 3) 굽는 도구 고르기: Rufus vs balenaEtcher

어떤 도구든 "ISO를 USB에 그대로 기록"한다는 점은 같습니다. 화면이 다를 뿐입니다.

| | **balenaEtcher** | **Rufus** |
| --- | --- | --- |
| 지원 OS | 윈도우 · macOS · 리눅스 | 윈도우 |
| 설치 | 설치 파일 실행(설치형) | 설치 없이 실행되는 `.exe` |
| 화면 | **버튼 3개** (파일 → USB → Flash!) | 옵션이 많음 (파티션 방식, 파일 시스템 등) |
| 공식 가이드 | macOS에서 안내 | 윈도우에서 안내 |
| 초보 추천 | ✅ 화면이 단순해 실수할 곳이 적음 | 옵션을 이해하고 있다면 빠름 |

> 💡 이미 우분투를 쓰고 있다면 기본 앱 **Disks**로도 됩니다: USB 선택 → 우측 상단 메뉴 → **Restore Disk Image…** → ISO 선택 → **Start Restoring…**. 단, USB가 아닌 **시스템 디스크를 고르지 않도록** 목록에서 용량을 꼭 확인하세요.
>
> 💡 윈도우에서 Rufus를 쓴다면: **장치**(USB) 선택 → **SELECT**(ISO 파일) → **START** → "ISOHybrid 이미지" 안내에서 **ISO Image mode** 확인 → 경고 확인 → 상태가 **READY**가 되면 **CLOSE**. 부팅이 안 되면 `Partitioning scheme=GPT`, `Target system=UEFI (non CSM)`로 바꿔 다시 굽습니다.

### 4) balenaEtcher로 USB 만들기 — 버튼 3개

<https://etcher.balena.io/> 에서 내려받아 설치(또는 압축 해제)하고 실행합니다.

![balenaEtcher 3단계 — Flash from file → Select target → Flash!](https://velog.velcdn.com/images/aiexcelh/post/7b38f55b-4ca8-4ff0-8610-1fdb272ae2f5/image.png)

*왼쪽부터 순서대로. 가운데 단계(Select target)에서 USB 용량을 확인하는 것이 가장 중요합니다.*

**① Flash from file** — 받아 둔 `.iso` 선택

- 창 왼쪽의 **Flash from file** 버튼을 누릅니다.
- 파일 선택 창이 열리면 **다운로드** 폴더의 `ubuntu-24.04.5-desktop-amd64.iso`를 고르고 **열기**.
- 고르면 왼쪽 칸에 파일 이름과 용량(약 5.9GB)이 표시됩니다.

**② Select target** — USB 선택 (⚠️ 여기가 사고 지점)

- USB를 **미리 꽂아 둔 상태**에서 가운데 **Select target** 버튼을 누릅니다.
- 목록에서 **용량 숫자**로 내 USB를 확인하고 고릅니다. 예: `Generic Flash Disk · 14.9 GB`.
- 외장하드(예: `1.8 TB`)나 내장 디스크가 함께 보인다면 절대 고르지 마세요. **이 단계에서 고른 디스크의 내용은 전부 지워집니다.**

**③ Flash!** — 굽고 기다리기

- 오른쪽 **Flash!** 버튼을 누릅니다. 관리자 권한을 묻는 창이 뜨면 허용합니다.
- `Flashing…` → `Validating…` → **`Flash Complete!`** 까지 기다립니다(5~20분).
- 완료 전에 USB를 뽑거나 창을 닫으면 USB를 다시 만들어야 합니다.

**Etcher가 말을 안 들을 때**

| 증상 | 해결 |
| --- | --- |
| USB가 목록에 안 보임 | 다른 포트에 꽂기, 파일 탐색기에서 창 닫기, Etcher 재실행 |
| "Flash failed" | USB를 뽑았다 다시 꽂고 재시도, 다른 USB로 시도 |
| 권한 창이 계속 뜸 | 관리자 계정으로 실행, 백신의 실시간 감시 잠시 해제 |

### 5) USB가 제대로 만들어졌는지 확인

윈도우에서 USB를 열어 보면 파일 몇 개만 보이거나 "포맷하시겠습니까?" 창이 뜰 수 있는데, **이건 정상**입니다. 우분투 ISO는 여러 파티션으로 기록되기 때문에 윈도우가 일부만 읽습니다. **포맷하지 마세요.**

확인은 USB로 부팅해서 **GRUB 메뉴가 뜨는지**로 하는 것이 가장 확실합니다(3장).

---

## 3. USB로 부팅하기: BIOS/UEFI와 GRUB

### 1) BIOS/UEFI가 뭔가요?

**BIOS 또는 UEFI**는 메인보드에 내장된 펌웨어로, 운영체제가 켜지기 전에 하드웨어를 초기화하고 **어느 장치에서 부팅할지** 결정합니다. 최근 PC는 대부분 UEFI를 쓰지만, 사용자가 설정 화면을 부를 때는 여전히 "BIOS"라고 부릅니다.

핵심은 **부팅 순서(Boot Order)** 입니다. 기본값은 내장 디스크(윈도우)로 되어 있으니, 이번 한 번만 USB를 먼저 보게 바꿔야 합니다.

두 가지 방법이 있습니다.

| | **부트 메뉴(One-time Boot Menu)** | **BIOS 설정 화면** |
| --- | --- | --- |
| 하는 일 | 이번 한 번만 부팅할 장치 선택 | 부팅 순서를 저장해 계속 유지 |
| 장점 | 설정을 되돌릴 필요 없음 | 매번 키를 누르지 않아도 됨 |
| 추천 | ✅ 설치할 때는 이쪽 | 설치 후 기본 순서를 바꿀 때 |

### 2) 전원을 켜고 GRUB까지

![부팅 메뉴 키 → USB 선택 → GRUB에서 Try or Install Ubuntu](https://velog.velcdn.com/images/aiexcelh/post/247aeede-caa5-4a97-91e0-2a9fe347dfa3/image.png)

*왼쪽 아래 검은 화면이 GRUB입니다. 첫 줄 `Try or Install Ubuntu`가 기본 선택되어 있습니다.*

1. USB를 꽂고 PC를 **완전히 종료**합니다. (윈도우의 "다시 시작"이 아니라 **종료 후 전원 켜기**)
2. 전원을 켜자마자 **부트 메뉴 키를 연타**합니다. 로고가 뜨기 전부터 톡톡톡 누르는 느낌으로.
3. 목록에서 **USB**를 고릅니다. `UEFI: SanDisk …` 처럼 **UEFI가 붙은 항목**을 고르세요.
4. 잠시 뒤 검은 **GRUB** 화면이 나옵니다.

부팅 메뉴 키는 제조사마다 다릅니다.

| 제조사 | 부트 메뉴 (이번 한 번) | BIOS 설정 |
| --- | --- | --- |
| 삼성 | **F10** (2012년 이전 모델은 Esc) | F2 |
| LG | **F10** | F2 |
| 레노버 | **F12** (Fn+F12) | F2 (일부 F1, ThinkPad는 모델별) |
| ASUS | **Esc** (일부 F8) | F2 또는 Del |
| HP | **Esc → F9** | Esc → F10 |
| 델 | **F12** | F2 |
| 조립 PC (MSI/기가바이트/ASRock) | F11 / F12 / F11 | Del (일부 F2) |

> 💡 노트북에서 F2·F10을 눌렀는데 화면 밝기만 바뀐다면 **Fn 키를 함께** 눌러 보세요(Fn+F2 등).
> 💡 부팅 중 화면 구석에 "Press F12 for Boot Menu" 같은 **짧은 안내 문구**가 뜨기도 합니다.
> 💡 우분투 공식 안내 기준으로 **F12가 가장 흔하고, Esc·F2·F10도 자주 쓰입니다.**

### 3) BIOS 설정 화면에서 직접 바꾸는 방법

1. 부트 메뉴 키 대신 **BIOS 설정 키**(보통 F2, Del)로 진입합니다.
2. **Boot** 탭으로 이동합니다.
3. **Boot Option #1**(또는 Boot Priority)을 **USB**로 바꿉니다.
4. **저장하고 종료** — 보통 **F10** → Save & Exit → Yes.

### 4) USB가 목록에 안 보일 때

1. USB를 **다른 포트**에 꽂습니다. 데스크탑은 **뒤쪽** 포트가 인식이 잘 됩니다.
2. BIOS에서 **Secure Boot**를 잠시 끕니다.
3. **Fast Boot**(고속 부팅)를 끕니다.
4. **Legacy/CSM** 옵션이 있다면 UEFI 모드로 두고 다시 시도합니다.
5. USB를 **다시 굽습니다**(2장). 굽는 도중 실패한 경우가 의외로 많습니다.

### 5) Secure Boot는 꺼야 하나요?

**일부 노트북은 Secure Boot가 켜져 있으면 서명되지 않은 부팅 이미지를 막습니다.** USB 부팅 자체가 안 되거나, 설치 후 부팅이 안 된다면 잠시 끄고 시도해 보세요. 설치가 끝난 뒤에는 다시 켜도 됩니다.

> 💡 서드파티 드라이버(NVIDIA 등)를 함께 설치하기로 했다면, 설치 도중 **"보안 키(security key)를 만들라"**는 화면이 나옵니다. 그 키를 적어 두고, 재부팅 때 나오는 파란 **MOK 관리 화면**에서 등록해야 드라이버가 동작합니다(4-14 참고).

### 6) GRUB 화면에서 할 일

검은 화면에 이런 항목들이 보입니다.

```text
Try or Install Ubuntu
Ubuntu (safe graphics)
OEM install (for manufacturers)
Test memory
Boot from next volume
UEFI Firmware Settings
```

- **↑ ↓** 로 항목을 옮기고 **Enter**로 선택합니다. 마우스는 동작하지 않습니다.
- 가만히 두면 몇 초 뒤 **첫 항목(`Try or Install Ubuntu`)으로 자동 진행**합니다.
- 화면이 깨지거나 멈추면 **`Ubuntu (safe graphics)`** 를 골라 보세요. 그래픽 드라이버 문제를 피해 부팅하는 모드입니다.
- `Try or Install Ubuntu`를 고르면 잠시 뒤 우분투 데스크톱(설치 프로그램)이 뜹니다.

> 💡 여기까지 왔는데 윈도우가 다시 켜진다면 → 부팅 순서가 디스크로 되어 있는 것입니다. 3-4의 "USB가 목록에 안 보일 때"를 확인하세요.

---

## 4. 설치 마법사 — 화면 13개, 하나씩

Ubuntu 24.04는 **새 설치 프로그램(Subiquity 기반)** 을 씁니다. 23.10까지와 화면 순서·이름이 다르므로, 인터넷의 옛 글과 헷갈리지 않도록 아래 순서를 기준으로 보세요.

![설치 마법사 핵심 네 화면 — 언어·키보드 / 설치 방식 / 디스크 / 계정](https://velog.velcdn.com/images/aiexcelh/post/847eef4a-1992-486a-9025-d037fcf1d8a2/image.png)

*이 네 화면만 제대로 넘기면 나머지는 `Next`를 눌러도 됩니다. 맨 아래 줄(설치 완료 → 재시작)은 꼭 기억하세요.*

**화면 공통 규칙**

- 각 화면 **오른쪽 아래**에 **Next**(다음) / **Back**(이전) 버튼이 있습니다.
- 화면 **오른쪽 위**의 접근성 아이콘에서 화면 읽기·확대·고대비를 언제든 켤 수 있습니다.
- 확신이 없으면 **기본값 그대로 Next**를 눌러도 쓸 만한 시스템이 됩니다.

### 4-1. `Welcome to Ubuntu` — 언어

- **화면 제목**: Welcome to Ubuntu
- **고를 것**: `English` (권장) 또는 `한국어`
- **왜**: 이 언어는 **설치 화면 문구에만** 쓰입니다. 설치 후의 시스템 언어·한글 입력은 5장에서 따로 설정합니다. 영어로 두면 화면 제목을 검색해 문제를 찾기 쉽습니다.
- **다음**: **Next**

### 4-2. Accessibility — 접근성

- 확대, 큰 글씨, 화면 읽기, 화면 대비 등이 있습니다.
- 필요한 기능이 없으면 **그대로 Next**. 모두 설치 후에 바꿀 수 있습니다.

### 4-3. `Keyboard layout` — 키보드 배열

- **화면 제목**: Keyboard layout
- **고를 것**: `English (US)` (권장) 또는 `Korean` → `Korean (101/104 key compatible)`
- **왜**: 한글 키보드도 **물리 배열은 US와 같습니다.** 여기서 무엇을 고르든 5장에서 한글 입력기를 따로 추가하므로, 처음에는 `English (US)`가 편합니다.
- 가운데 입력 칸에 글자를 쳐서 자판이 맞는지 확인할 수 있습니다.
- **다음**: **Next**

> ⚠️ `Korean (101/104 key compatible)`를 골라 두면 나중에 한/영 전환키가 따로 등록되지 않아 헤매는 경우가 있습니다. 5-4에서 설명하는 방식(`Korean (Hangul)`을 입력 소스로 추가)을 권장합니다.

### 4-4. `Internet connection` — 와이파이 연결 여부

- **화면 제목**: Internet connection
- **선택지**: `Use wired connection` / `Connect to a Wi-Fi network` / `Do not connect to the internet`
- **고를 것**: 가능하면 **연결**하세요. 와이파이는 목록에서 SSID를 고르고 비밀번호를 입력합니다.
- **왜**: 연결하면 설치 중에 **최신 업데이트와 서드파티 드라이버(NVIDIA, 와이파이 펌웨어)** 를 함께 받습니다. 나중에 한 번에 끝낼 수 있어 시간이 절약됩니다.
- 연결하지 않아도 설치는 됩니다. 다만 4-8의 드라이버 항목이 비활성화되고, 설치 후 `apt update`를 따로 해야 합니다.
- **다음**: **Next**

### 4-5. `Try or install Ubuntu` — 설치할지, 체험만 할지

- **선택지**: `Install Ubuntu` / `Try Ubuntu`
- **고를 것**: **`Install Ubuntu`** → **Next**
- **왜**: `Try Ubuntu`는 설치 없이 USB에서만 켜 보는 모드입니다. 하드웨어가 우분투와 맞는지 미리 확인하고 싶다면 `Try Ubuntu`로 부팅한 뒤, 바탕화면의 **Install Ubuntu** 아이콘을 눌러 설치로 넘어가면 됩니다.

> ⚠️ 일부 PC는 **Intel RST(Rapid Storage Technology)** 를 쓰는데, 이 모드에서는 우분투가 디스크를 인식하지 못합니다. 경고가 뜨면 설치를 멈추고 윈도우에서 AHCI로 바꾼 뒤 다시 시도하세요(공식 안내: <https://help.ubuntu.com/rst/>).

### 4-6. `Type of installation` — 설치 방식

- **선택지**: `Interactive installation` / `Automated with autoinstall file` (또는 `Automated with Landscape`)
- **고를 것**: **`Interactive installation`** → **Next**
- **왜**: Interactive는 화면을 보며 한 단계씩 설정하는 **표준 경로**입니다. Automated는 설정 파일(autoinstall.yaml)을 미리 준비해 **여러 대를 똑같이** 설치할 때 쓰는 고급 기능입니다. 파일이 없으면 진행할 수 없습니다.

### 4-7. `Applications` — 기본 앱 선택

- **화면 제목**: Applications (질문: *What apps would you like to install to start with?*)
- **선택지**: `Default selection` / `Extended selection`
- **고를 것**: **`Extended selection`** (권장)
- **왜**: 24.04부터 기본값이 **최소 설치**로 바뀌었습니다.

| 선택 | 들어가는 것 | 추천 |
| --- | --- | --- |
| `Default selection` | 필수 요소, 웹 브라우저, 기본 유틸리티 | 최소 구성, 나중에 필요한 것만 |
| `Extended selection` | + 오피스 도구(LibreOffice), 유틸리티, 오프라인에서 쓸 문서 도구 | ✅ 로봇 개발용 PC |

- 나중에 App Center나 `apt`로 언제든 추가할 수 있습니다.

### 4-8. `Optimize your computer` — 서드파티 소프트웨어

- **화면 제목**: Optimize your computer (질문: *Install recommended proprietary software?*)
- **고를 것**: **두 항목 모두 체크** (권장)
  - ☑ `Install third-party software for graphics and Wi-Fi hardware` — NVIDIA 드라이버, 와이파이/블루투스 펌웨어
  - ☑ `Download and install support for additional media formats` — MP3·MP4 등 코덱
- **왜**: 체크하지 않으면 **NVIDIA 그래픽이 느리게 동작**하거나, 동영상이 재생되지 않고, 와이파이가 잡히지 않을 수 있습니다. 특히 NVIDIA 노트북이면 반드시 체크하세요.

> ⚠️ 이 항목을 체크하면 Secure Boot가 켜진 PC에서는 **"보안 키(security key)를 정하라"**는 화면이 이어집니다. 지금 정한 비밀번호를 **적어 두세요.** 재부팅 때 파란 **MOK 관리** 화면에서 등록해야 드라이버가 활성화됩니다(4-14).

### 4-9. `Disk setup` — 디스크 (가장 중요한 갈림길)

- **화면 제목**: Disk setup (질문: *How do you want to install Ubuntu?*)
- **선택지**: `Erase disk and install Ubuntu` / `Install Ubuntu alongside …`(다른 OS가 있을 때만) / `Manual installation`

| 선택 | 결과 | 추천 상황 |
| --- | --- | --- |
| **Erase disk and install Ubuntu** | 선택한 디스크를 **전부 지우고** 우분투 단독 설치 | 로봇 실습 전용 PC, 기존 데이터 없음 |
| **Install Ubuntu alongside …** | 기존 OS를 유지하고 공간을 나눠 설치 (슬라이더로 크기 조절) | 윈도우를 남기고 듀얼부팅 |
| **Manual installation** | 파티션을 직접 구성 | 숙련자, 별도 `/home` 등 특수 구성 |

**Erase disk를 고를 때**

- 이름 그대로 디스크를 비웁니다. **백업은 선택이 아니라 필수**입니다.
- 디스크가 **두 개 이상**이면 어느 디스크에 설치할지 다시 물어봅니다. 용량으로 확인하세요. (우분투를 외장 디스크에 설치하는 것도 이 방식입니다.)

**Alongside를 고를 때**

- 윈도우가 **BitLocker로 암호화**되어 있으면 설치 프로그램이 윈도우를 읽지 못해 이 옵션이 보이지 않거나 경고가 뜹니다. 윈도우에서 **BitLocker를 끄고** 다시 시도하세요.
- 슬라이더로 우분투가 쓸 공간을 정합니다. 40~60GB 이상을 권장합니다.

> 💡 **멀티부팅**은 한 디스크를 **파티션**으로 나눠 "디스크 두 개처럼" 쓰는 방식입니다. 부팅할 때 GRUB 메뉴에서 우분투와 Windows Boot Manager 중 하나를 고르게 됩니다.
>
> 💡 윈도우에서 미리 공간을 확보하려면 **디스크 관리**에서 파티션을 축소해 빈 공간을 만들어 둡니다. 반대로 기존 리눅스 파티션을 지울 때는 **볼륨 삭제**를 쓰는데, 되돌릴 수 없으니 대상 볼륨을 세 번 확인하세요.

**디스크 암호화(선택)** — 최신 24.04 이미지에서는 `Erase disk`를 고른 뒤 **디스크 암호화 여부**를 묻는 화면이 이어질 수 있습니다. 실습용 PC라면 끄고 진행해도 됩니다. 켜면 **부팅할 때마다** 암호를 입력해야 하고, 잊으면 데이터를 복구할 수 없습니다.

### 4-10. `Create your account` — 계정 만들기

- **화면 제목**: Create your account
- **입력할 것**:

| 항목 | 예시 | 설명 |
| --- | --- | --- |
| `Your name` | `Robot` | 표시되는 이름. 한글도 가능 |
| `Your computer's name` | `robot-pc` | 네트워크에 보이는 PC 이름 |
| `Your username` | `robot` | **홈 폴더 이름**이 됨 → `/home/robot` |
| `Password` | (기억할 수 있는 것) | `sudo` 권한과 직결 |
| `Confirm password` | 위와 동일 | 한 번 더 입력 |

- ☑ `Require my password to log in` — 그대로 두는 것을 권장합니다. (`Log in automatically`는 편하지만, 노트북을 들고 다닌다면 위험합니다.)
- ☐ `Use Active Directory` — 회사·학교에서 계정을 중앙 관리할 때만. **여기서는 체크하지 마세요.**
- **다음**: **Next**

> ⚠️ **username은 반드시 영문 소문자**로. 대문자·공백·한글이 들어가면 터미널 경로(`/home/robot`)와 ROS 2 노드 경로에 그대로 들어가 이후 스크립트·빌드 도구에서 예상치 못한 오류가 생깁니다. 설치 화면도 "소문자로 시작하고 소문자·숫자·하이픈·밑줄만" 허용한다고 안내합니다.
>
> 💡 비밀번호는 잊으면 복구가 번거로우니 **메모해 두세요.** 실습용이라면 짧아도 되지만, 실제 사용 환경이라면 길고 복잡하게.

### 4-11. `Select your timezone` — 시간대

- 지도에서 **Seoul**(Asia/Seoul)을 고르거나, `Location`/`Timezone` 칸에 `seoul`을 입력합니다.
- 인터넷에 연결되어 있으면 위치를 자동으로 잡아 주기도 합니다.
- **다음**: **Next**

### 4-12. `Ready to install` — 최종 확인

- 지금까지 고른 내용(**언어, 키보드, 디스크, 계정, 시간대**)이 요약됩니다.
- 틀린 항목이 있으면 **Back**으로 돌아가 고칩니다.
- 확인했으면 **Install**을 누릅니다. 여기서부터 실제로 디스크에 기록됩니다.

### 4-13. 설치 중 — 기다리기

- 우분투 소개 슬라이드가 돌아가고, 아래/오른쪽의 **자세히 보기 아이콘**을 누르면 실제 설치 로그를 볼 수 있습니다.
- 보통 **10~30분** 걸립니다. 진행률이 한동안 멈춘 것처럼 보여도 정상입니다.
- 이 동안에는 **창을 닫거나 USB를 뽑지 마세요.**

### 4-14. `Installation complete` — 재시작과 USB 분리 (여기서 많이 막힙니다)

1. 설치가 끝나면 **Installation complete** 화면이 뜹니다. **`Restart Now`** 를 누릅니다.
2. 화면이 검게 바뀌며 이 문구가 나옵니다.

```text
Please remove the installation medium, then press ENTER.
```

3. **USB를 뽑고**, 키보드의 **Enter**를 누릅니다. (노트북이면 USB를 뽑은 뒤 Enter)
4. 재부팅되어 로그인 화면이 나오면 설치 끝입니다.

> ⚠️ **USB를 뽑지 않고 Enter를 누르면** 다시 설치 USB로 부팅해 설치 화면이 처음부터 나옵니다. 설치된 내용이 지워지는 것은 아니니, 당황하지 말고 USB만 뽑고 다시 켜면 됩니다.
>
> 💡 **Secure Boot + 서드파티 드라이버**를 함께 설치했다면, 재부팅 때 파란 **`Perform MOK management`** 화면이 나옵니다. 이때 **`Enroll MOK`** → **`Continue`** → **`Yes`** → (4-8에서 정한 보안 키 입력) → **`Reboot`** 를 고르면 드라이버가 등록됩니다. **`Continue boot`** 를 눌러 그냥 넘어가면 NVIDIA 드라이버가 동작하지 않을 수 있습니다.

### 4-15. 첫 로그인 — 초기 설정

- 24.04부터는 첫 로그인 후 **간단한 초기 설정 화면**이 뜹니다. 위치 서비스, 진단 정보 전송(기본은 보내지 않음), 테마 색상, 추가 앱 등을 묻습니다.
  - 회사·학교 PC가 아니라면 기본값으로 넘어가면 됩니다.
  - **Ubuntu Pro** 안내가 나오면 개인용은 최대 5대까지 무료이지만, 지금은 건너뛰어도 됩니다.
- 바탕화면이 보이면 설치 성공입니다.

---

## 5. 설치 직후 첫 세팅

### 5-1. 시스템 업데이트부터

*⌨️ 입력 위치: 설치가 끝난 우분투의 새 터미널*

```bash
sudo apt update
sudo apt upgrade
```

- `update`는 패키지 목록을, `upgrade`는 실제 설치본을 최신으로 만듭니다.
- 중간에 `Do you want to continue? [Y/n]` 이 나오면 **`Y`** 를 입력하고 Enter.
- 커널이 업데이트되면 재부팅을 권장합니다.

```bash
sudo reboot
```

> GUI로 하려면 앱 목록에서 **Software Updater**를 실행해도 같은 효과입니다.
>
> 습관: 로봇 PC는 아침에 켤 때 `sudo apt update && sudo apt upgrade`를 한 번씩 돌리는 것이 좋습니다. 다만 ROS 2 프로젝트가 특정 버전에 묶여 있다면, 업그레이드 후 동작을 다시 확인하는 절차를 두는 편이 안전합니다.

**설치가 잘 됐는지 확인**

```bash
lsb_release -a
uname -r
```

- 첫 명령은 `Ubuntu 24.04.x LTS`가 나오면 정상, 두 번째는 커널 버전입니다.

### 5-2. 터미널 열기

- 왼쪽 아래 **앱 표시** → `Terminal` 검색 → 실행
- 단축키: `Ctrl` + `Alt` + `T`
- 종료는 `exit` 또는 창 닫기

### 5-3. Terminator: 창 분할 터미널

로봇 개발에서는 터미널을 최소 3~4개 띄웁니다. 기본 터미널은 창을 여러 개 띄워야 하지만, **Terminator**는 한 창을 여러 칸으로 나눌 수 있어 화면 관리가 훨씬 편합니다.

```bash
sudo apt install terminator
```

| 기능 | 단축키 |
| --- | --- |
| 가로 분할(위/아래) | `Ctrl` + `Shift` + `O` |
| 세로 분할(좌/우) | `Ctrl` + `Shift` + `E` |
| 다음/이전 칸으로 이동 | `Ctrl` + `Shift` + `N` / `Ctrl` + `Shift` + `P` |
| 새 탭 | `Ctrl` + `Shift` + `T` |
| 현재 칸 닫기 | `Ctrl` + `Shift` + `W` |

**기본 터미널로 지정하려면**(선택)

```bash
sudo update-alternatives --config x-terminal-emulator
```

목록에서 `terminator`의 번호를 입력하고 Enter. 이제 `Ctrl`+`Alt`+`T`로 Terminator가 열립니다. 작업 표시줄 아이콘을 우클릭해 **Pin to Dash** 해 두면 더 편합니다.

#### 무한 스크롤백 켜기 (로봇 개발 필수 설정)

기본 터미널은 스크롤백이 **500줄**입니다. 센서 로그가 초당 수십 줄씩 쏟아지면 몇 초 만에 앞부분이 사라져 디버깅이 불가능해집니다.

1. Terminator 창에서 우클릭 → **Preferences**
2. **Profiles** 탭 → **Scrolling** 탭
3. **Infinite Scrollback** 체크

> 공식 문서 기준으로 이 옵션은 기본값이 **꺼짐**이고, 켜면 "세션 시작 이후의 모든 줄이 보존"됩니다. 데이터는 하부 터미널 컴포넌트가 디스크에 두기 때문에 메모리 부담도 크지 않습니다.

### 5-4. 한글 입력 설정

우분투는 기본 입력기로 **IBus**를 쓰고, 한글은 **ibus-hangul** 엔진이 처리합니다. 순서가 조금 헷갈리므로 그림과 함께 천천히 따라오세요.

![한글 입력 설정 클릭 순서 — Settings → Keyboard → Input Sources + → Korean → Korean (Hangul) → Add](https://velog.velcdn.com/images/aiexcelh/post/507a0daf-24fb-4bd4-a2b6-7a8c85fe1973/image.png)

*6번 클릭이면 끝납니다. 아래쪽에서 전환키와 "Korean이 안 보일 때"를 확인하세요.*

**1단계 — 한국어 언어 지원 설치(권장)**

1. **Settings** → **System** → **Region & Language** → **Manage Installed Languages** 클릭
   (또는 앱 목록에서 **Language Support** 실행)
2. "언어 지원이 완전히 설치되지 않았다"는 안내가 뜨면 **Install** 실행
3. **Install / Remove Languages…** → 목록에서 **Korean** 체크 → **Apply** → 비밀번호 입력
4. **재부팅** (이 단계에서 목록에 Korean이 안 보이면 재부팅이 원인인 경우가 많습니다)

**2단계 — 입력 소스에 한글 추가**

1. **Settings** → **Keyboard**
2. **Input Sources** 아래의 **`+`** 버튼 클릭
3. 목록에서 **Korean** 클릭 → **`Korean (Hangul)`** 선택 → **Add**
4. Input Sources 목록에 **Korean (Hangul)** 이 생기면 성공

> ⚠️ `Korean (101/104 key compatible)`를 고르면 한/영 전환이 제대로 동작하지 않는 경우가 많습니다. 반드시 **Hangul** 항목을 고르세요.

**3단계 — 한/영 전환 확인**

| 무엇을 바꾸나 | 기본 단축키 |
| --- | --- |
| 입력 소스(영어 ↔ 한국어) 전환 | **Super(윈도우 키) + Space** |
| 한/영 토글 (ibus-hangul) | **Shift + Space** 또는 **한/영 키** |

- 단축키 목록은 **Settings → Keyboard → Keyboard Shortcuts → Typing** 에서 확인·변경할 수 있습니다.
- 한/영 키를 직접 등록하려면: Input Sources의 **Korean (Hangul)** 오른쪽 메뉴(점 3개) → **Preferences** → **Hangul Toggle Key**의 **Add** → 안내 창이 뜬 상태에서 키보드의 **한/영 키**를 누름 → **OK**.

> 💡 기본으로 잡혀 있는 **Shift + Space**는 코드 편집에서 대소문자/공백 조작과 충돌하는 경우가 있습니다. 코딩용 PC라면 Shift+Space 항목은 지우고 한/영 키만 남기는 편이 편합니다.

**한글이 안 될 때 체크리스트**

1. Input Sources 목록에 **2개 이상**(English + Korean)이 있는가
2. **재부팅**했는가 (언어 지원 설치 후)
3. `Super`+`Space`를 눌러 입력 소스가 바뀌는가 (화면 상단에 `En`/`Ko` 표시)
4. 터미널에서 입력기를 재시작:

```bash
ibus restart
```

5. 위가 모두 안 되면 입력기를 직접 설치:

```bash
sudo apt install ibus-hangul
```

> 💡 파일명·폴더명은 한글보다 영문이 안전합니다. 주석도 영문으로 쓰는 습관을 들이면 인코딩 문제로 시간을 잃는 일이 줄어듭니다.

### 5-5. Chrome 설치

우분투 기본 브라우저는 Firefox입니다. Chrome이 필요하다면 공식 `.deb` 패키지를 받아 설치합니다.

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb
```

- `wget`: URL에서 파일을 내려받는 명령입니다(약 100MB).
- `.deb`: 데비안/우분투 계열의 설치 패키지 형식입니다 (윈도우의 `.exe`).
- `apt install ./파일.deb`: **`./`를 빼면** apt가 저장소에서 같은 이름을 찾으려 해서 "찾을 수 없음" 오류가 납니다.
- `apt`는 의존성까지 자동으로 해결해 주므로, 예전 방식(`sudo dpkg -i` 후 `sudo apt -f install`)보다 이 방법을 권장합니다.

**실행과 기본 브라우저 지정**

```bash
google-chrome
```

기본 브라우저로 지정하려면 **Settings → Apps → Default Apps**에서 **Web** 항목을 Google Chrome으로 바꿉니다.

### 5-6. 설치가 끝났는지 한 번에 확인

```bash
lsb_release -d
apt list --installed terminator google-chrome-stable
```

`Ubuntu 24.04.x LTS`와 두 패키지가 보이면 이 글의 과정은 모두 끝난 것입니다.

---

## 6. 자주 막히는 지점

| 증상 | 원인 | 해결 |
| --- | --- | --- |
| BIOS 화면이 안 열림 | 진입 키가 제조사마다 다름 | 전원 직후 F2/F12/Del/Esc 연타, Fn 조합, 짧은 안내 문구 확인 |
| USB가 부트 메뉴에 안 보임 | 포트·Secure Boot·굽기 실패 | 다른 포트(뒤쪽), Secure Boot 끄기, USB 다시 굽기 |
| USB로 부팅이 안 되고 윈도우만 뜸 | 부팅 순서가 디스크로 되어 있음 | Boot Option #1을 USB로, 필요 시 Secure Boot 해제 |
| GRUB까지 갔는데 화면이 깨지거나 멈춤 | 그래픽 드라이버 문제 | GRUB에서 `Ubuntu (safe graphics)` 선택 |
| 설치 중 "Intel RST" 경고 | 인텔 Rapid Storage가 디스크를 RAID 모드로 점유 | BIOS에서 RST 해제(공식 안내: <https://help.ubuntu.com/rst/>) |
| `Install alongside`가 안 보임 | 윈도우 BitLocker 또는 빈 공간 부족 | BitLocker 끄기, 윈도우 디스크 관리에서 파티션 축소 |
| `Please remove the installation medium` 이 반복 | USB를 뽑지 않고 Enter | USB 뽑고 Enter, 그래도 반복되면 BIOS 부팅 순서 확인 |
| 재부팅 후 파란 `MOK management` 화면 | 서드파티 드라이버 + Secure Boot | `Enroll MOK` → `Continue` → `Yes` → 보안 키 입력 → `Reboot` |
| 설치 후 윈도우만 뜸 | GRUB 우선순위 | BIOS 부팅 순서에서 `ubuntu`를 1순위로 |
| `apt install ./파일.deb` 실패 | `./` 누락 또는 파일명 오타 | `ls`로 현재 폴더 확인 후 다시 실행 |
| 한글 입력이 안 됨 | 입력 소스 미추가 또는 재부팅 누락 | Korean(Hangul) 추가 → 재부팅 → 전환키 확인 |
| 한/영 키가 안 먹음 | `Korean (101/104...)`를 고름 | `Korean (Hangul)`로 다시 추가 |
| `apt upgrade` 중 물어봄 | 설정 파일 충돌 | 기본값 유지(Enter) 또는 `--force-confold` 옵션 검토 |

---

## 7. 설치 완료 체크리스트

- [ ] `lsb_release -d` → `Ubuntu 24.04.x LTS`
- [ ] `sudo apt update && sudo apt upgrade` 완료 (재부팅까지)
- [ ] 터미널 실행, `exit`로 종료 확인
- [ ] Terminator 설치, `Ctrl+Shift+O` / `Ctrl+Shift+E` 분할 확인
- [ ] Terminator **Infinite Scrollback** 켜기
- [ ] 한글 입력 소스 추가, `Super`+`Space`·한/영 키로 전환 확인
- [ ] Chrome 설치 및 기본 브라우저 지정
- [ ] `pwd`, `ls`, `cd ~` 동작 확인
- [ ] 전원을 껐다 켜도 정상 부팅 (USB 없이)

여기까지 오면 로봇 개발을 위한 **바닥 공사**가 끝난 것입니다. 다음 글에서는 파이썬 프로젝트마다 환경을 분리하는 **가상환경(venv)** 을 다룹니다. 로봇 코드는 라이브러리 버전에 민감하기 때문에, 이 단계를 건너뛰면 나중에 반드시 한 번은 되돌아오게 됩니다.

---

## 8. 되돌리고 싶을 때

| 상황 | 방법 |
| --- | --- |
| 우분투를 지우고 윈도우만 남기기 | 윈도우 설치 USB로 부팅해 파티션 삭제 후 복구, 또는 윈도우 **디스크 관리**에서 우분투 파티션 삭제 → BIOS 부팅 순서를 Windows로 |
| 설치를 처음부터 다시 | 같은 USB로 부팅해 `Erase disk and install Ubuntu`를 다시 실행 (기존 우분투는 지워짐) |
| USB를 원래대로 쓰고 싶다 | 윈도우 **디스크 관리 → 볼륨 삭제 → 새 단순 볼륨**으로 포맷, 또는 우분투 **Disks** 앱에서 포맷 |

> ⚠️ 파티션 삭제는 **되돌릴 수 없습니다.** 지울 파티션의 이름·크기를 세 번 확인하세요.

---

## 이 글에 나온 명령어·기호 풀이

| 표기 | 원래 말 / 읽는 법 | 하는 일 |
| --- | --- | --- |
| `sudo` | superuser do | 관리자(root) 권한으로 실행 |
| `apt` | Advanced Package Tool | 우분투 패키지 관리자 |
| `apt update` | — | 저장소의 최신 **목록만** 갱신 (설치 X) |
| `apt upgrade` | — | 그 목록대로 실제 업그레이드 |
| `apt install` | — | 패키지 설치 |
| `-y` | yes | 확인 질문에 자동으로 yes |
| `lsb_release -a` | Linux Standard Base | 우분투 버전 확인 |
| `uname -r` | unix name | 커널 버전 확인 |
| `sha256sum` | — | 파일의 지문(SHA-256) 계산 — 다운로드 무결성 확인 |
| `ibus restart` | — | 한글 입력기(IBus) 재시작 |
| `cd` | change directory | 폴더 이동 |
| `~/Downloads` | — | 내 홈의 `Downloads`(다운로드) 폴더 |
| `ls` | list | 폴더 안의 파일 목록 |
| `./파일이름` | — | **현재 폴더에 있는** 파일을 지목할 때 앞에 붙입니다 (`./` 없으면 시스템이 다른 곳에서 찾음) |
| `.iso` | — | 운영체제 전체가 담긴 **디스크 이미지** 파일 |
| `.deb` | — | 우분투용 설치 파일 확장자 (윈도우의 `.exe`) |
| `amd64` | — | 인텔·AMD용 64비트 CPU 버전 (요즘 PC는 대부분 여기) |
| `google-chrome` | — | 크롬 실행 파일 이름 (설치 확인용) |
| `terminator` | — | 창 분할 터미널 프로그램 이름 |
| `Ctrl`+`Alt`+`T` | — | 새 터미널 창 열기 |
| `Ctrl`+`Shift`+`T` | — | 터미널 **새 탭** |
| `Ctrl`+`Shift`+`O` | — | Terminator에서 **가로 분할** |
| `Ctrl`+`Shift`+`E` | — | Terminator에서 **세로 분할** |
| `Ctrl`+`Shift`+`C` / `V` | — | 터미널에서 복사 / 붙여넣기 |

> 마법사 화면에서 고르는 항목(`Erase disk`, `Install alongside`, `Manual installation`)은 **명령어가 아니라 선택지 이름**입니다. 4장의 표와 그림을 보고 고르면 됩니다.

## 공식 문서 참고

- Ubuntu Desktop 설치 가이드: <https://documentation.ubuntu.com/desktop/en/latest/tutorial/install-ubuntu-desktop/>
- Ubuntu Desktop 문서(부팅 USB 만들기, 플랫폼별 도구): <https://documentation.ubuntu.com/desktop/en/latest/how-to/create-a-bootable-usb-stick/>
- Ubuntu 24.04 LTS 이미지(과거 릴리스·대체 다운로드): <https://ubuntu.com/download/alternative-downloads>
- balenaEtcher: <https://etcher.balena.io/>
- Rufus: <https://rufus.ie/>
- Ubuntu 언어 설치 안내(Region & Language → Manage Installed Languages): <https://documentation.ubuntu.com/desktop/en/latest/how-to/software/install-languages/>
- Ubuntu에서 Intel RST 문제 해결: <https://help.ubuntu.com/rst/>
- Terminator 공식 문서(환경설정·스크롤백): <https://gnome-terminator.readthedocs.io/en/latest/preferences.html>
- Terminator 저장소(단축키 정리): <https://github.com/gnome-terminator/terminator>
- Google Chrome Linux용 다운로드: <https://www.google.com/chrome/>
- APT 패키지 관리: <https://documentation.ubuntu.com/server/how-to/software/package-management/>
