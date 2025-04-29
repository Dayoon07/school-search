# school-search

![](https://dayoon07.github.io/school-search/img/cap.png)

나이스 대국민서비스에서 발급받은 API키로 만든 학교 정보 검색 웹 사이트입니다.
그리고 중간에 비동기 처리하다가 문제가 발생했음. 한번에 요청할 수 있는 API 요청이 1000건만 조회할 수 있게 제한을 둬서 for문으로 전부 끌어올 수 있게 함

## 라이브러리 목록
없음

## 기능
```
function search() {
    const searchText = document.getElementById("text").value.trim().toLowerCase();
    if (!allSchools.length) {
        document.getElementById("len").textContent = "데이터를 불러오는 중입니다. 잠시 후 다시 시도해주세요.";
        return;
    }
    
    if (searchText) {
        const filteredSchools = allSchools.filter(school => {
            const schoolName = (school.SCHUL_NM || '').toLowerCase();
            const eduOffice = (school.ATPT_OFCDC_SC_NM || '').toLowerCase();
            const schoolType = (school.SCHUL_KND_SC_NM || '').toLowerCase();

            return schoolName.includes(searchText) ||
                    eduOffice.includes(searchText) ||
                    schoolType.includes(searchText);
        });
        displayResults(filteredSchools);
    } else {
        displayResults([]);
    }
}
```
여기서 SCHUL_NM, ATPT_OFCDC_SC_NM, SCHUL_KND_SC_NM는 각각 학교명, 시도교육청명, 학교종류명임. <br />

예시 <br />
- SCHUL_NM : 근명고등학교 <br />
- ATPT_OFCDC_SC_NM : 경기도교육청 <br />
- SCHUL_KND_SC_NM : 고등학교

이런식으로 검색하기 조금 편하게 만들어 놓음. 사실 이거 만든 이유가 API 키는 어떻게 동작하는지 알고 싶어서 즉흥적으로 API 키 발급받아서 한 거임.

## 레포 복사
되게 간단함
1. 레포지토리 클론하기
    ```bash
    git clone https://github.com/Dayoon07/school-search.git
    ```
2. Visual Studio Code에서 클론한 레포 열고 index.html 열기

## 사용 기술
HTML, CSS, JavaScript 끝