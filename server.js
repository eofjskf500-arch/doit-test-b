const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
// 학번 202610395의 마지막 세 자리(395)에 3을 붙여 포트 3395 사용
const PORT = process.env.PORT || 3395;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// 메모리 저장 (서버 재시작 또는 서버리스 재실행 시 초기화될 수 있음)
let todos = [
  { id: 1, text: '아침 운동하기' },
  { id: 2, text: '이메일 확인하기' },
  { id: 3, text: '장보기' },
];
let nextId = 4;

app.get('/todo', (req, res) => {
  res.json(todos);
});

app.post('/todo', (req, res) => {
  const text = (req.body.text || '').trim();
  if (text) todos.push({ id: nextId++, text });
  res.redirect('/');
});

// PUT /todo/:id : 할일 수정
app.put('/todo/:id', (req, res) => {
  const id = Number(req.params.id);
  const text = (req.body.text || '').trim();
  const todo = todos.find((item) => item.id === id);

  if (!todo) return res.status(404).send('할일을 찾을 수 없습니다.');
  if (!text) return res.status(400).send('할일 내용을 입력하세요.');

  todo.text = text;
  res.redirect('/');
});

// DELETE /todo/:id : 할일 삭제
app.delete('/todo/:id', (req, res) => {
  const id = Number(req.params.id);
  const exists = todos.some((item) => item.id === id);
  if (!exists) return res.status(404).send('할일을 찾을 수 없습니다.');

  todos = todos.filter((item) => item.id !== id);
  res.redirect('/');
});

// Vercel에서는 export한 app을 서버리스 함수로 사용
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

module.exports = app;
