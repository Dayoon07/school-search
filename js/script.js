let allSchools = []; // 전역 변수로 선언

async function fetchAllSchools() {
    const pageSize = 1000;

    try {
        const firstResponse = await fetch(`https://open.neis.go.kr/hub/schoolInfo?KEY=7043e492d33b44899030f56649800edc&Type=json&pIndex=1&pSize=${pageSize}`);
        const firstData = await firstResponse.json();

        if (firstData.RESULT) {
            console.error("API 에러:", firstData.RESULT);
            document.getElementById("len").textContent = `데이터 로딩 실패: ${firstData.RESULT.MESSAGE}`;
            return [];
        }

        if (!firstData.schoolInfo) {
            console.error("데이터를 불러오는 데 실패했습니다.");
            document.getElementById("len").textContent = "데이터 형식이 올바르지 않습니다.";
            return [];
        }

        const totalCount = firstData.schoolInfo[0].head[0].list_total_count;
        const totalPages = Math.ceil(totalCount / pageSize);

        allSchools = firstData.schoolInfo[1].row;

        for (let page = 2; page <= totalPages; page++) {
            try {
                const response = await fetch(`https://open.neis.go.kr/hub/schoolInfo?KEY=7043e492d33b44899030f56649800edc&Type=json&pIndex=${page}&pSize=${pageSize}`);
                const data = await response.json();

                if (data.RESULT) {
                    console.error(`페이지 ${page} 로딩 중 API 에러:`, data.RESULT);
                    continue;
                }

                if (data.schoolInfo && data.schoolInfo[1].row) {
                    allSchools = allSchools.concat(data.schoolInfo[1].row);
                }
            } catch (pageError) {
                console.error(`페이지 ${page} 로딩 중 오류:`, pageError);
                continue;
            }
        }

        document.getElementById("len").textContent = `총 ${allSchools.length}개의 학교가 있습니다`;
        return allSchools;

    } catch (error) {
        console.error("학교 정보를 불러오는 중 오류 발생:", error);
        document.getElementById("len").textContent = "데이터를 불러오는데 실패했습니다.";
        return [];
    }
}

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

function displayResults(schools) {
    const container = document.getElementById("id");
    container.innerHTML = "";

    const schoolsWithHomepage = schools.filter(school => 
        school.HMPG_ADRES && 
        school.HMPG_ADRES.trim() !== '' && 
        school.HMPG_ADRES.toLowerCase() !== 'null'
    );

    if (schoolsWithHomepage.length > 0) {
        document.getElementById("len").textContent = `검색결과: ${schoolsWithHomepage.length}개의 학교 (홈페이지 있는 학교만 표시)`;
        schoolsWithHomepage.forEach(school => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <h3>${school.SCHUL_NM || '이름 없음'}</h3>
                <p><strong>시도교육청명:</strong> ${school.ATPT_OFCDC_SC_NM || '정보 없음'}</p>
                <p><strong>학교종류명:</strong> ${school.SCHUL_KND_SC_NM || '정보 없음'}</p>
                <p><strong>설립명:</strong> ${school.FOND_SC_NM || '정보 없음'}</p>
                <p><strong>주소:</strong> ${school.ORG_RDNMA || '정보 없음'}</p>
                <p><strong>홈페이지:</strong> <a href="${school.HMPG_ADRES}" target="_blank">${school.HMPG_ADRES}</a></p>
            `;

            container.appendChild(card);
        });
    } else {
        document.getElementById("len").textContent = "검색된 결과가 없습니다";
        container.innerHTML = "<h1 id='center'>검색된 결과가 없습니다.</h1>";
    }
}

window.onload = async () => {
    document.getElementById("len").textContent = "데이터를 불러오는 중입니다...";
    await fetchAllSchools();
};

document.getElementById("text").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        search();
    }
});