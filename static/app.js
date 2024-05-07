// 메모를 수정하는 비동기 함수
async function editMemo(event) {
  // 수정할 메모의 ID를 가져옴
  const id = event.target.dataset.id;
  // 사용자에게 수정할 내용을 입력 받음
  const editInput = prompt("수정할 값을 입력하세요");
  // 서버에 수정 요청을 보냄
  const res = await fetch(`/memos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      content: editInput,
    }),
  });
  // 모든 메모를 다시 읽어와서 화면에 표시
  readMemo();
}

// 메모를 삭제하는 비동기 함수
async function delteBtn(event) {
  // 삭제할 메모의 ID를 가져옴
  const id = event.target.dataset.id;
  // 서버에 삭제 요청을 보냄
  const res = await fetch(`/memos/${id}`, {
    method: "DELETE",
  });
  // 모든 메모를 다시 읽어와서 화면에 표시
  readMemo();
}

// 메모를 화면에 표시하는 함수
function displayMemo(memo) {
  // 메모를 표시할 리스트를 선택
  const ul = document.querySelector("#memo-ul");
  // 새로운 리스트 아이템 생성
  const li = document.createElement("li");
  li.innerText = `${memo.content}`;

  // 수정 버튼 생성 및 이벤트 리스너 추가
  const editBtn = document.createElement("button");
  editBtn.innerText = "수정하기";
  editBtn.addEventListener("click", editMemo);
  editBtn.dataset.id = memo.id;

  // 삭제 버튼 생성 및 이벤트 리스너 추가
  const delBtn = document.createElement("button");
  delBtn.innerText = "삭제";
  delBtn.addEventListener("click", delteBtn);
  delBtn.dataset.id = memo.id;

  // 리스트 아이템에 버튼 추가 후, 화면에 표시
  li.appendChild(editBtn);
  li.appendChild(delBtn);
  ul.appendChild(li);
}

// 서버에서 모든 메모를 가져와 화면에 표시하는 비동기 함수
async function readMemo() {
  // 서버에서 메모 데이터를 가져옴
  const res = await fetch("/memos");
  const jsonRes = await res.json();
  // 기존에 표시된 메모를 모두 제거
  const ul = document.querySelector("#memo-ul");
  ul.innerHTML = "";
  // 각 메모를 화면에 표시
  jsonRes.forEach(displayMemo);
}

// 새로운 메모를 생성하고 서버에 저장하는 비동기 함수
async function createMemo(value) {
  // 서버에 메모 생성 요청을 보냄
  const res = await fetch("/memos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: new Date().getTime().toString(), // 유니크한 ID 생성
      content: value,
    }),
  });
  // 모든 메모를 다시 읽어와서 화면에 표시
  readMemo();
}

// 메모 생성 폼 제출 이벤트 핸들러
function handleSubmit(event) {
  // 폼 기본 제출 동작 방지
  event.preventDefault();
  // 입력된 메모 내용으로 새 메모 생성
  const input = document.querySelector("#memo-input");
  createMemo(input.value);
  // 입력 필드 초기화
  input.value = "";
}

// 메모 생성 폼에 이벤트 리스너 추가
const form = document.querySelector("#memo-form");
form.addEventListener("submit", handleSubmit);

// 페이지 로딩 시 모든 메모를 읽어와서 화면에 표시
readMemo();
