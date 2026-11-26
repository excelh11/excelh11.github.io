---
title: ".bashrc로 ROS 2 환경 자동화 + ROS_DOMAIN_ID 격리"
description: "매 Terminal마다 source를 치지 않도록, 그리고 다른 로봇과 통신이 섞이지 않도록 설정합니다."
date: 2026-11-26 09:05:00 +0900
series: robot-setup
order: 5
---

ROS 2를 설치하고 나면 이런 생각이 듭니다.

> "매 Terminal마다 `source /opt/ros/jazzy/setup.bash`를 쳐야 하나?"

네, 쳐야 합니다. Shell은 Terminal마다 새로 뜨고, 환경변수는 Shell에 속하기 때문입니다. 하지만 이 반복은 **`.bashrc`** 에 한 줄 넣는 것으로 끝낼 수 있습니다.

이 글은 세 가지를 다룹니다.

1. `.bashrc`로 ROS 2 환경을 **자동화**하기
2. `alias`로 긴 명령을 **짧게 줄이기**
3. `ROS_DOMAIN_ID`로 **다른 로봇과 통신이 섞이지 않게 격리**하기

세 가지 모두 "Terminal을 조금 더 똑똑하게 쓰는 법"이지만, 로봇 개발에서는 편의를 넘어 **사고를 막는 안전장치**이기도 합니다.

---

## 명령은 어디에 입력하나요?

이 글의 명령은 **일반 Terminal**에서 입력합니다. `.bashrc` 를 편집할 때만 편집기가 하나 더 필요합니다.

| 입력할 곳 | 여는 방법 | 무엇을 하나 |
| --- | --- | --- |
| Terminal | `Ctrl` + `Alt` + `T` | 모든 확인·설정 명령 |
| `.bashrc` 편집 창 | `code ~/.bashrc` 또는 `nano ~/.bashrc` | 파일 내용 추가·저장 |

- 편집기에서 저장한 뒤에는 **`source ~/.bashrc`** 를 입력해야 현재 창에 반영됩니다. (새 창을 열면 자동 반영)
- `~` 는 내 홈 폴더이므로 `~/.bashrc` 는 `/home/사용자명/.bashrc` 와 같은 파일입니다.
- 복사는 `Ctrl`+`Shift`+`C`, 붙여넣기는 `Ctrl`+`Shift`+`V` 입니다.

## 한눈에 보는 전체 흐름: Terminal → .bashrc → ROS 환경 → 도메인

![새 Terminal에서 .bashrc가 실행되어 ROS 환경이 적용되는 흐름](https://velog.velcdn.com/images/aiexcelh/post/4c469935-d208-4ebb-8c72-7f75da8d5242/image.png)

*`.bashrc`는 Terminal을 열 때마다 자동으로 실행되므로, 여기에 넣으면 매번 `source`를 치지 않아도 됩니다.*

1. **새 Terminal** — bash가 새로 시작
2. **`.bashrc` 자동 실행** — 파일 맨 아래 줄까지 실행
3. **ROS 2 환경 등록** — `source /opt/ros/jazzy/setup.bash`
4. **`alias` · `ROS_DOMAIN_ID`** — 짧은 명령과 로봇 그룹 번호
5. **같은 도메인끼리 통신** — `ros2 node list`에 상대 Node가 보임

---

## 1. Shell(셸)과 시작 파일

### 현재 Shell 확인

*⌨️ 입력 위치: Terminal · `$` 뒤에 입력하고 `Enter`*

```bash
echo $SHELL
```

```text
/bin/bash
```

Ubuntu의 기본 Shell은 **bash**입니다. `$SHELL`은 "로그인 Shell"을 가리키는 환경변수입니다.

### bash는 언제 어떤 파일을 읽나

bash는 실행될 때 상황에 따라 다른 파일을 읽습니다.

| 실행 형태 | 읽는 파일 |
| --- | --- |
| 로그인 Shell (예: 콘솔 로그인, `ssh` 접속) | `/etc/profile` → `~/.bash_profile` → `~/.bash_login` → `~/.profile` 중 첫 번째 존재하는 것 |
| **대화형 비로그인 Shell (Terminal 앱을 열 때)** | **`~/.bashrc`** |
| 비대화형 (스크립트 실행) | `$BASH_ENV`가 있으면 그것 |

우리가 GUI에서 Terminal을 열 때는 **대화형 비로그인 Shell**이므로 `~/.bashrc`가 읽힙니다. 그래서 ROS 2 환경 설정은 `.bashrc`에 넣는 것이 맞습니다.

![Terminal을 4개로 나눈 화면 — 칸마다 별개의 bash가 떠 있고, 칸마다 .bashrc의 "ROS2 Jazzy is activated"가 한 번씩 찍혀 있다](https://velog.velcdn.com/images/aiexcelh/post/e9062050-bedf-448e-8eca-a00c215b4a29/image.png)

*Terminator 같은 Terminal을 분할해 쓰면 **칸마다 별개의 bash**가 실행됩니다. 그래서 `.bashrc`도 칸마다 한 번씩 읽히고(`ROS2 Jazzy is activated`가 칸마다 찍혀 있는 것이 그 증거입니다), `source ~/.bashrc`도 지금 커서가 있는 칸에만 적용됩니다. "옆 창에서는 되는데 이 창에서는 `ros2`가 안 된다"는 상황이 바로 이것입니다. (Ubuntu 24.04 + Terminator 화면 — 프롬프트의 `user@robot-pc`는 예시 계정 이름이고, 각자 PC에서는 자기 계정 이름이 표시됩니다.)*

> `~`는 홈 디렉터리(`/home/사용자명`)이고, 파일 이름 앞의 `.`은 **숨김 파일**이라는 표시입니다. `ls`로는 보이지 않고 `ls -a`로 확인할 수 있습니다.

### `.bashrc` 확인하기

*⌨️ 입력 위치: Terminal · `$` 뒤에 입력하고 `Enter`*

```bash
ls -a ~ | grep bashrc
wc -l ~/.bashrc
tail -20 ~/.bashrc
```

편집은 아무 편집기나 가능합니다.

*⌨️ 입력 위치: Terminal — 편집기를 여는 명령 · `$` 뒤에 입력하고 `Enter`*

```bash
code ~/.bashrc      # VS Code로 열기
nano ~/.bashrc      # Terminal 편집기
```

> 편집기에서 저장만 한다고 바로 적용되지 않습니다. **새 Terminal을 열거나 `source ~/.bashrc`를 실행**해야 반영됩니다.

---

## 2. ROS 2 환경 자동 활성화

`.bashrc` **맨 마지막**에 다음 두 줄을 추가합니다.

*⌨️ 입력 위치: **`.bashrc` 파일 안** — 편집기에서 맨 아래에 추가 · `$` 뒤에 입력하고 `Enter`*

```bash
# ROS 2 Jazzy 환경 자동 설정
echo "ROS2 Jazzy is activated"
source /opt/ros/jazzy/setup.bash
```

| 줄 | 역할 |
| --- | --- |
| `echo "..."` | Terminal을 열 때 문구를 출력해 "ROS 2가 켜졌다"는 것을 눈으로 확인 |
| `source /opt/ros/jazzy/setup.bash` | ROS 2 환경변수를 현재 Shell에 등록 |

> 왜 `echo`를 넣나요? 자동 활성화는 **조용히** 일어나기 때문에, 실제로 적용됐는지 알기 어렵습니다. 문구 하나로 확인할 수 있어 디버깅이 쉬워집니다.

### `source`가 정확히 하는 일

`source`(또는 `.`)는 **지정한 파일의 내용을 현재 Shell에서 실행**하는 명령입니다. 스크립트를 별도 프로세스로 실행하는 것과 다릅니다.

*⌨️ 입력 위치: Terminal — 왜 안 되는지 비교하는 예 · `$` 뒤에 입력하고 `Enter`*

```bash
bash setup.bash     # 자식 프로세스에서 실행 → 끝나면 환경변수 사라짐 (X)
source setup.bash   # 현재 Shell에서 실행 → 환경변수 유지 (O)
```

이 차이 때문에 ROS 2 환경 설정에는 반드시 `source`를 써야 합니다. `bash`로 실행하면 스크립트가 끝나는 순간 환경이 사라집니다.

### 적용 확인

*⌨️ 입력 위치: Terminal — 수정한 뒤 반영 · `$` 뒤에 입력하고 `Enter`*

```bash
source ~/.bashrc
ros2 --help
echo $ROS_DISTRO
```

```text
jazzy
```

---

## 3. `alias`: 긴 명령을 짧게

`source`를 `.bashrc`에 넣으면 자동으로 켜지지만, 경우에 따라 **필요할 때만** ROS 2를 켜고 싶을 수 있습니다. 이때 쓰는 것이 **`alias`(별칭)** 입니다.

### 기본 문법

*⌨️ 입력 위치: Terminal · `$` 뒤에 입력하고 `Enter`*

```bash
alias 이름='명령'
```

예:

*⌨️ 입력 위치: **`.bashrc` 파일 안** 에 추가 · `$` 뒤에 입력하고 `Enter`*

```bash
alias jazzy='source /opt/ros/jazzy/setup.bash'
```

이제 `jazzy`라고만 입력해도 같은 일이 일어납니다.

> ⚠️ **등호(`=`) 양옆에 공백을 넣으면 안 됩니다.**
>
> ```bash
> alias jazzy = 'source /opt/ros/jazzy/setup.bash'   # ✗ 오류
> alias jazzy='source /opt/ros/jazzy/setup.bash'     # ✓
> ```
>
> 이 실수는 정말 자주 나옵니다. 오류 메시지가 "command not found"로 나와서 원인을 찾기 어렵습니다.

### 등록된 alias 확인

*⌨️ 입력 위치: Terminal · `$` 뒤에 입력하고 `Enter`*

```bash
alias
```

인자 없이 `alias`만 실행하면 현재 등록된 별칭 목록이 **다시 실행 가능한 형태**로 출력됩니다.

### 자주 쓰는 alias 예시

*⌨️ 입력 위치: Terminal — 편집기를 여는 명령 · `$` 뒤에 입력하고 `Enter`*

```bash
# ROS 2 환경 켜기
alias jazzy='source /opt/ros/jazzy/setup.bash'

# .bashrc 수정 후 즉시 적용
alias sb='source ~/.bashrc'

# .bashrc 바로 편집
alias eb='code ~/.bashrc'

# 자주 쓰는 ROS 2 조회 명령
alias rn='ros2 node list'
alias rt='ros2 topic list -t'
alias rs='ros2 service list -t'
```

> `alias`는 **현재 Shell에만** 적용됩니다. Terminal을 새로 열면 사라지므로, 계속 쓰려면 `.bashrc`에 적어 둡니다.

### alias vs `.bashrc` 자동 source: 무엇을 쓸까

| 방식 | 장점 | 단점 |
| --- | --- | --- |
| `.bashrc`에 `source` 직접 | 항상 켜져 있어 편함 | 모든 Terminal이 ROS 2 환경을 물고 시작 (일반 작업 시 약간의 부담) |
| `alias`로 필요할 때만 | 선택적으로 켤 수 있음, 기본 Shell이 가벼움 | 매번 `jazzy` 입력 필요 |

학습·실습 단계에서는 `.bashrc`에 넣는 편이 편하고, 한 PC로 문서 작업과 ROS 2 개발을 오간다면 alias 방식이 깔끔합니다. **둘을 함께 써도 됩니다.** (예: 자동 활성화 + 자주 쓰는 조회 명령 alias)

---

## 4. `ROS_DOMAIN_ID`: 통신을 격리하는 스위치

### 문제 상황

ROS 2는 **DDS(Data Distribution Service)** 라는 통신 미들웨어를 씁니다. DDS는 IP 주소를 일일이 지정하지 않고, **같은 네트워크에서 자동으로 서로를 발견**해 Message를 주고받습니다.

- 장점: 설정 없이 바로 통신. 로봇과 PC를 같은 공유기에 연결하면 끝.
- 단점: **같은 네트워크의 모든 ROS 2 Node가 서로 보입니다.**

실습실에서 열 명이 동시에 Turtlesim을 켜면, 내 거북이에게 보낸 명령이 옆자리 거북이에도 적용될 수 있습니다. 실제 로봇이라면 "내 로봇, 앞으로"가 다른 사람 로봇에 전달되어 **물리적 사고**로 이어질 수 있습니다.

![ROS_DOMAIN_ID가 다르면 같은 네트워크에서도 서로 보이지 않는다](https://velog.velcdn.com/images/aiexcelh/post/5a243f8c-f203-4984-96ff-4fdb52d4d00d/image.png)

*도메인 번호가 다르면 같은 공유기에 연결돼 있어도 발견조차 되지 않습니다.*

### 해결: 같은 도메인끼리만 통신

DDS는 **도메인(Domain)** 이라는 논리적 구역을 나눌 수 있고, ROS 2는 이를 **`ROS_DOMAIN_ID`** 환경변수로 제어합니다.

*⌨️ 입력 위치: Terminal (지금 창에만 적용) · `$` 뒤에 입력하고 `Enter`*

```bash
export ROS_DOMAIN_ID=13
```

| 사실 | 내용 |
| --- | --- |
| 기본값 | **0** (모든 ROS 2 Node는 기본적으로 도메인 0) |
| 같은 도메인 | 서로 발견하고 통신 가능 |
| 다른 도메인 | 서로 **발견조차 하지 못함** |
| 권장 범위(Linux) | **0~101** |
| 이론적 최대 | 232 |

### 왜 0~101인가

도메인 ID는 DDS가 사용하는 **UDP 포트 번호**를 계산하는 데 쓰입니다. 포트 번호는 16비트(0~65535)이므로 도메인 ID의 상한이 계산으로 정해지고(최대 232), 동시에 **운영체제가 임시로 쓰는 포트 범위**와 겹치지 않아야 합니다. Linux Kernel은 기본적으로 32768~60999를 임시 포트로 쓰기 때문에, 공식 문서는 **0~101을 안전 구간**으로 안내합니다.

> ⚠️ 102~214 구간은 임시 포트와 충돌할 수 있어 권장되지 않습니다. (215~232는 Linux에서 사용 가능하지만, 특수한 경우에만 쓰는 편이 안전합니다.)

### 설정 방법

**일시적(현재 Shell만):**

*⌨️ 입력 위치: Terminal (지금 창에만 적용) · `$` 뒤에 입력하고 `Enter`*

```bash
export ROS_DOMAIN_ID=13
```

**영구적(`.bashrc`에 추가):**

*⌨️ 입력 위치: Terminal — 수정한 뒤 반영 · `$` 뒤에 입력하고 `Enter`*

```bash
echo "export ROS_DOMAIN_ID=13" >> ~/.bashrc
source ~/.bashrc
```

확인:

*⌨️ 입력 위치: Terminal · `$` 뒤에 입력하고 `Enter`*

```bash
echo $ROS_DOMAIN_ID
```

### 운영 팁

- **팀/로봇별로 번호를 정해 두세요.** 예: 1번 로봇 11, 2번 로봇 12, 시뮬레이션 21.
- **PC와 로봇이 통신해야 한다면 같은 번호**를 써야 합니다. 반대로 **분리하고 싶으면 다른 번호**를 씁니다.
- 도메인을 바꾼 뒤에는 **모든 Node를 재시작**해야 합니다. 이미 실행 중인 Node는 이전 도메인에 남아 있습니다.

*⌨️ 입력 위치: Terminal · `$` 뒤에 입력하고 `Enter`*

```bash
# 통신이 안 될 때 점검 순서
echo $ROS_DOMAIN_ID          # 두 Terminal의 값이 같은가
ros2 topic list              # 상대 Node의 Topic이 보이는가
ros2 daemon stop && ros2 daemon start   # 발견 캐시 초기화
```

> `ros2 daemon`은 CLI가 Node 정보를 캐시하는 백그라운드 프로세스입니다. 도메인을 바꿨는데 목록이 그대로라면 데몬을 재시작하면 해결되는 경우가 많습니다.

---

## 5. `.bashrc`를 안전하게 다루는 법

`.bashrc`는 Shell이 시작될 때마다 실행되는 파일입니다. 잘못 고치면 **Terminal이 아예 열리지 않거나** 오류 메시지가 쏟아질 수 있습니다.

### 원칙 1: 백업 먼저

*⌨️ 입력 위치: Terminal · `$` 뒤에 입력하고 `Enter`*

```bash
cp ~/.bashrc ~/.bashrc.backup
```

### 원칙 2: 맨 아래에, 주석과 함께

기존 내용 중간에 끼워 넣으면 다른 설정과 얽힙니다. **파일 끝에 블록으로 추가**하세요.

*⌨️ 입력 위치: Terminal — 수정한 뒤 반영 · `$` 뒤에 입력하고 `Enter`*

```bash
# ===== ROS 2 =====
source /opt/ros/jazzy/setup.bash
export ROS_DOMAIN_ID=13
alias sb='source ~/.bashrc'
```

### 원칙 3: 저장 후 반드시 적용

*⌨️ 입력 위치: Terminal — 수정한 뒤 반영 · `$` 뒤에 입력하고 `Enter`*

```bash
source ~/.bashrc
```

### 원칙 4: 문제가 생기면 되돌리기

```bash
cp ~/.bashrc.backup ~/.bashrc
source ~/.bashrc
```

> Terminal이 열리지 않을 정도로 깨졌다면, `Ctrl`+`Alt`+`F3`으로 가상 콘솔에 로그인해 파일을 고치거나, 복구 모드로 진입해 백업을 복원합니다. 백업이 있으면 되돌리는 일이 간단하지만, 없으면 손이 많이 갑니다.

### `.bashrc`가 실행되지 않는 경우

스크립트(비대화형)에서는 `.bashrc`가 읽히지 않습니다. 예를 들어 크론(cron)이나 systemd 서비스에서 ROS 2 Node를 실행할 때는 환경이 자동으로 잡히지 않습니다. 이 경우에는 스크립트 안에서 명시적으로 `source`를 호출해야 합니다.

*⌨️ 입력 위치: Terminal (지금 창에만 적용) · `$` 뒤에 입력하고 `Enter`*

```bash
#!/bin/bash
source /opt/ros/jazzy/setup.bash
export ROS_DOMAIN_ID=13
exec ros2 launch my_robot bringup.launch.py
```

> 로봇을 부팅하자마자 자동으로 Node를 띄우는 구성(자동 시작 서비스)을 만들 때 반드시 필요한 패턴입니다.

---

## 6. 자주 겪는 문제

| 증상 | 원인 | 해결 |
| --- | --- | --- |
| `.bashrc` 수정이 반영 안 됨 | `source` 안 함 / 새 Terminal 안 열음 | `source ~/.bashrc` |
| `alias: =: not found` | 등호 양옆 공백 | 공백 제거 |
| `ros2: command not found` | `source` 누락 또는 경로 오타 | `tail ~/.bashrc`로 확인, `ls /opt/ros/jazzy/setup.bash` |
| Terminal 열 때마다 오류 메시지 | `.bashrc` 문법 오류 | 백업 복원, `bash -n ~/.bashrc`로 문법 검사 |
| 다른 사람과 Topic이 섞임 | `ROS_DOMAIN_ID` 미설정(둘 다 0) | 서로 다른 번호 지정 |
| 도메인 바꿨는데 목록이 그대로 | `ros2 daemon` 캐시 | `ros2 daemon stop && ros2 daemon start` |
| `alias`가 새 Terminal에서 사라짐 | `.bashrc`에 안 적음 | `.bashrc`에 추가 후 `source` |

---

## 7. 정리

*⌨️ 입력 위치: Terminal — 수정한 뒤 반영 · `$` 뒤에 입력하고 `Enter`*

```bash
# 1) 백업
cp ~/.bashrc ~/.bashrc.backup

# 2) 파일 끝에 추가
cat >> ~/.bashrc << 'EOF'

# ===== ROS 2 =====
source /opt/ros/jazzy/setup.bash
export ROS_DOMAIN_ID=13
alias jazzy='source /opt/ros/jazzy/setup.bash'
alias sb='source ~/.bashrc'
EOF

# 3) 적용
source ~/.bashrc

# 4) 확인
echo $ROS_DISTRO $ROS_DOMAIN_ID
```

- Terminal을 열면 bash가 **`~/.bashrc`를 읽습니다**. 여기에 `source`를 넣으면 ROS 2가 자동으로 켜집니다.
- `alias`는 긴 명령을 줄여 주지만, **등호 양옆 공백 금지**를 잊지 마세요.
- `ROS_DOMAIN_ID`는 **같은 값끼리만 통신**하게 만드는 격리 장치이고, Linux에서는 **0~101**을 쓰는 것이 안전합니다.
- 로봇이 여러 대인 환경에서 이 한 줄을 빠뜨리면, 명령이 다른 로봇에 전달되는 사고가 날 수 있습니다.

다음 글에서는 드디어 ROS 2의 핵심인 **Node·Service·Topic·Action**을 Turtlesim으로 직접 다뤄 봅니다. 명령어를 하나씩 실행하면서 "로봇이 어떻게 움직이는가"를 눈으로 확인합니다.

---

## 이 글에 나온 명령어·기호 풀이

| 표기 | 원래 말 / 읽는 법 | 하는 일 |
| --- | --- | --- |
| `echo $SHELL` | — | 지금 쓰는 Shell의 경로(`/bin/bash`)를 출력 |
| `ls -a ~` &#124; `grep bashrc` | — | 홈 폴더의 숨김 파일 중 `bashrc` 가 든 것만 표시 |
| `-a` | all | 숨김 파일까지 표시 |
| `~` | tilde | 내 홈 폴더 |
| &#124; | 파이프 | 앞 출력을 뒤 명령의 입력으로 |
| `grep` | — | 특정 글자가 든 줄만 걸러 냄 |
| `code ~/.bashrc` | — | `.bashrc` 를 VS Code로 열기 |
| `source ~/.bashrc` | — | 수정한 `.bashrc` 를 **지금 창에 즉시 적용** |
| `bash setup.bash` | — | **자식 프로세스**로 실행 → 끝나면 환경이 사라짐 (그래서 `source` 를 씀) |
| `alias 이름='명령'` | — | 긴 명령에 **별명**을 붙임 |
| `alias` | — | 지금 등록된 별명 목록 |
| `export 이름=값` | — | 환경변수를 **정의하고 자식에게도 전달** |
| `echo "..." >> ~/.bashrc` | `>>` | 파일 **끝에 한 줄 추가** (덮어쓰지 않음) |
| `echo $ROS_DOMAIN_ID` | — | 지금 값 확인 (비어 있으면 0으로 동작) |
| `cp A B` | copy | A를 B로 복사 (백업) |
| `ROS_DOMAIN_ID` | — | 로봇 그룹 번호. **같은 번호끼리만** 통신 |
| `Ctrl`+`O`, `Ctrl`+`X` | — | `nano` 편집기에서 저장 / 종료 |
| `chmod +x 파일` | change mode | 스크립트에 실행 권한 부여 |
| `#!/bin/bash` | 셔뱅(shebang) | "이 파일은 bash로 실행하라"는 첫 줄 표시 |

> `.bashrc` 는 **Terminal을 새로 열 때마다 자동 실행**되는 파일입니다. 여기에 넣은 `export`·`alias`·`source` 는 그 뒤로 여는 모든 창에 자동 적용됩니다.

## 공식 문서 참고

- GNU Bash 매뉴얼 — 시작 파일(Bash Startup Files): <https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html>
- GNU Bash 매뉴얼 — `alias` 빌트인: <https://www.gnu.org/software/bash/manual/html_node/Aliases.html>
- GNU Bash 매뉴얼 — `source`/`.` 빌트인: <https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html>
- ROS 2 환경 설정(Shell 시작 파일에 source 추가, ROS_DOMAIN_ID): <https://docs.ros.org/en/jazzy/Tutorials/Beginner-CLI-Tools/Configuring-ROS2-Environment.html>
- ROS_DOMAIN_ID 개념(권장 범위 0~101): <https://docs.ros.org/en/jazzy/Concepts/Intermediate/About-Domain-ID.html>

## 이미지 출처

| 그림 | 출처 | 라이선스 |
| --- | --- | --- |
| Terminator 4분할 Terminal | 직접 제작 — Ubuntu 24.04 + Terminator 재현 화면 (`user@robot-pc`, ROS 2 Jazzy 실행 결과) | — |
| `.bashrc` 실행 흐름 / ROS_DOMAIN_ID | 직접 그린 도해 | — |
