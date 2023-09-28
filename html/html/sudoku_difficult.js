var audioElements = [document.getElementById("audio1"), document.getElementById("audio2"),document.getElementById("audio3"),document.getElementById("audio4"),document.getElementById("audio5"),document.getElementById("audio6"),document.getElementById("audio7"),document.getElementById("audio8"),document.getElementById("audio9")];
var currentAudioIndex = 0;
function playNextAudio() {
    currentAudioIndex = (currentAudioIndex + 1) % audioElements.length;
    audioElements[currentAudioIndex].play();
    audioElements[currentAudioIndex].addEventListener("ended", playNextAudio);
}
audioElements[currentAudioIndex].addEventListener("ended", playNextAudio);
audioElements[currentAudioIndex].play();
let generatedSudokus0 = [];
// 创建初始数字序列
function createInitial() {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = nums.length - 1; i >= 0; i--) {
    // Fisher–Yates 洗牌算法
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[randomIndex]] = [nums[randomIndex], nums[i]]; // 随机打乱数字序列
  }
  return nums; // 返回打乱后的初始数字序列
}
// 生成数独题目
function createPuzzle(generatedSudokus) {
  const initial = createInitial(); // 生成初始数字序列
  const puzzle = [];

  for (let i = 0; i < 9; i++) {
    const row = [];

    for (let j = 0; j < 9; j++) {
      row.push(initial[(i * 3 + Math.floor(i / 3) + j) % 9]); // 根据初始数字序列生成数独题目
    }
    puzzle.push(row); // 将行添加到数独题目中
  }
  generatedSudokus.push(puzzle);
  return puzzle; // 返回生成的数独题目
}
// 创建一个数独表格
function createSudokuTable(x,generatedSudokus) {
  const table = document.createElement('table'); // 创建表格元素
  table.setAttribute('id', `mytable${x}`);
  const puzzle = createPuzzle(generatedSudokus); // 生成数独题目
  for (let i = 0; i < 9; i++) {
    const row = document.createElement('tr'); // 创建表格行
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('td'); // 创建单元格
      if(Math.random()<0.25)
      {
        cell.textContent = puzzle[i][j]; // 设置单元格文本内容为数独数字
        row.appendChild(cell); // 将单元格添加到行中
      }
      else
      {
        const input = document.createElement('input');
        // cell.classList.add('emptycell'); // 添加样式以突出显示挖空单元格
        input.classList.add('empty-cell');
        input.type = 'number';
        input.maxLength = '1';
        input.addEventListener('input', validateInput); // 添加事件监听器以验证输入内容
        cell.appendChild(input);
        row.appendChild(cell); // 将单元格添加到行中
      }
    }
    table.appendChild(row); // 将行添加到表格中
  }

  return table; // 返回创建好的表格
}
// 验证输入内容是否合法，只能输入1到9的数字
function validateInput(event) {
  const input = event.target;
  const num = parseInt(input.value);

  if (isNaN(num) || num < 1 || num > 9) {
    input.value = ''; // 清空输入内容
  }
}
// 生成数独题目的主函数
function generateSudokus(i, generatedSudokus) {
  const container = document.getElementById('sudokuContainer');
    const table = createSudokuTable(i, generatedSudokus); // 创建数独表格
    container.appendChild(table); // 将表格添加到容器中
}
// 并发生成9个九宫格数独
function generateSudokuGridsConcurrently() {
  const generatedSudokus = []; // 定义一个数组来存储生成的数独
  // 记录代码开始执行的时间
  const startTime = performance.now();
  const container = document.getElementById('sudokuContainer');
  container.innerHTML = ''; // 清空容器中的内容
  const gridIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // 使用Promise.all来并发生成并填充9个不同的九宫格数独
Promise.all(gridIds.map(async (gridId) => {
      return generateSudokus(gridId, generatedSudokus);
  }))
      .then(() => {
          console.log("9个不同的九宫格数独生成完成");
      })
      .catch((error) => {
          console.error("生成九宫格数独时发生错误", error);
      });
      // 记录代码结束执行的时间
  const endTime = performance.now();

  // 计算代码执行的时间差
  const executionTime = endTime - startTime;

  // 显示执行时间
  const executionTimeElement = document.getElementById("execution-time");
  executionTimeElement.textContent = `数独生成时间：${executionTime.toFixed(2)} 毫秒`;
  generatedSudokus0 = generatedSudokus;
  for (let i=1; i<=9; i++)
  {
    var mytable = document.getElementById(`mytable${i}`);
    var puzzle = document.getElementById(`puzzle${i}`);
    var button = document.getElementById(`button${i}`);
    if(i!=1)
    {
      mytable.style.display = "none";
      puzzle.style.display = "none";
      button.style.color = "black";
    }
    else
    {
      mytable.style.display = "block";
      puzzle.style.display = "block";
        button.style.color = "white";
    }
  }
}

window.onload=function(){
  generateSudokuGridsConcurrently();
  
}
function fun0()
{
  for (let k=1; k<=9; k++)
  {
    var button = document.getElementById(`button${k}`);
    if(button.style.color == "white")
    {
      const g=generatedSudokus0[k-1];
      // 获取表格元素的引用
      const table = document.getElementById(`mytable${k}`);
      // 遍历表格行和单元格
      for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        for (let j = 0; j < row.cells.length; j++) {
          const cell = row.cells[j];
          // 检查单元格是否包含 input 元素
          const inputElement = cell.querySelector('input');
          if (inputElement) {
            inputElement.value = g[i][j];
            inputElement.readOnly=true;
            inputElement.style.backgroundColor = "green";
            button.style.color = "green"; //答案全部正确则按钮标绿
          }
        }
      }
      break;
    }
  }
}
function fun1()
{
  flag = 1;
  for (let k=1; k<=9; k++)
  {
    var button = document.getElementById(`button${k}`);
    if(button.style.color == "white")
    {
      const g=generatedSudokus0[k-1];
      // 获取表格元素的引用
      const table = document.getElementById(`mytable${k}`);
      // 遍历表格行和单元格
      for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        for (let j = 0; j < row.cells.length; j++) {
          const cell = row.cells[j];
          // 检查单元格是否包含 input 元素
          const inputElement = cell.querySelector('input');
          if (inputElement) {
            if(inputElement.value != g[i][j])
            {
              flag = 0;
              inputElement.style.backgroundColor = "red"; //如果等于答案则背景标红
            }
            else
            {
              inputElement.style.backgroundColor = "green"; //如果不等于答案则背景标绿
              inputElement.readOnly=true;
            }
          }
        }
      }
      if(flag==1)
      {
        button.style.color = "green"; //如果全部正确则按钮标绿
      }
      break;
    }
  }
}
function fun2()
{
  for (let k=1; k<=9; k++)
  {
    flag=0;
    var button = document.getElementById(`button${k}`);
    if(button.style.color == "white")
    {
      const g=generatedSudokus0[k-1];
      // 获取表格元素的引用
      const table = document.getElementById(`mytable${k}`);
      // 遍历表格行和单元格
      for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        for (let j = 0; j < row.cells.length; j++) {
          const cell = row.cells[j];
          // 检查单元格是否包含 input 元素
          const inputElement = cell.querySelector('input');
          if (inputElement) {
            if(inputElement.value != g[i][j])
            {
              inputElement.value = g[i][j];
              inputElement.style.backgroundColor = "green"; //如果等于答案则背景标绿
              inputElement.readOnly=true;
              flag=1;
              break;
            }
          }
        }
        if(flag==1)
        {
          break;
        }
      }
      break;
    }
  }
}
function fun3()
{
  flag=1;
  for (let k=1;k<=9;k++)
  {
    var button = document.getElementById(`button${k}`);
    if(button.style.color != "green")
    {
      flag=0;
      break;
    }
  }
  if(flag==1)
  {
    alert("恭喜你完成了所有数独游戏！请重新选择难度开始新一轮吧！"); //如果全部正确则弹出恭喜
    window.location.href = './页面3.html';// 返回选择界面
  }
  else
  {
    alert("还有数独游戏未完成！若已经填完答案，记得点一键检查确认结果哦！"); //如果有未完成则弹出提示
  }
}
function mytable1()
{

  for (let i=1; i<=9; i++)
  {
    var mytable = document.getElementById(`mytable${i}`);
    var puzzle = document.getElementById(`puzzle${i}`);
    var button = document.getElementById(`button${i}`);
    if(i!=1)
    {
      mytable.style.display = "none";
      puzzle.style.display = "none";
      if(button.style.color != "green")
      {
        button.style.color = "black";
      }
    }
    else
    {
      mytable.style.display = "block";
      puzzle.style.display = "block";
      if(button.style.color != "green")
      {
        button.style.color = "white";
      }
    }
  }
}
function mytable2()
{
  for (let i=1; i<=9; i++)
  {
    var mytable = document.getElementById(`mytable${i}`);
    var puzzle = document.getElementById(`puzzle${i}`);
    var button = document.getElementById(`button${i}`);
    if(i!=2)
    {
      mytable.style.display = "none";
      puzzle.style.display = "none";
      if(button.style.color != "green")
      {
        button.style.color = "black";
      }
    }
    else
    {
      mytable.style.display = "block";
      puzzle.style.display = "block";
      if(button.style.color != "green")
      {
        button.style.color = "white";
      }
    }
  }
}
function mytable3()
{
  for (let i=1; i<=9; i++)
  {
    var button = document.getElementById(`button${i}`);
    var mytable = document.getElementById(`mytable${i}`);
    var puzzle = document.getElementById(`puzzle${i}`);
    if(i!=3)
    {
      mytable.style.display = "none";
      puzzle.style.display = "none";
      if(button.style.color != "green")
      {
        button.style.color = "black";
      }
    }
    else
    {
      mytable.style.display = "block";
      puzzle.style.display = "block";
      if(button.style.color != "green")
      {
        button.style.color = "white";
      }
    }
  }
}
function mytable4()
{
  for (let i=1; i<=9; i++)
  {
    var button = document.getElementById(`button${i}`);
    var mytable = document.getElementById(`mytable${i}`);
    var puzzle = document.getElementById(`puzzle${i}`);
    if(i!=4)
    {
      mytable.style.display = "none";
      puzzle.style.display = "none";
      if(button.style.color != "green")
      {
        button.style.color = "black";
      }
    }
    else
    {
      mytable.style.display = "block";
      puzzle.style.display = "block";
      if(button.style.color != "green")
      {
        button.style.color = "white";
      }
    }
  }
}
function mytable5()
{
  for (let i=1; i<=9; i++)
  {
    var button = document.getElementById(`button${i}`);
    var mytable = document.getElementById(`mytable${i}`);
    var puzzle = document.getElementById(`puzzle${i}`);
    if(i!=5)
    {
      mytable.style.display = "none";
      puzzle.style.display = "none";
      if(button.style.color != "green")
      {
        button.style.color = "black";
      }
    }
    else
    {
      mytable.style.display = "block";
      puzzle.style.display = "block";
      if(button.style.color != "green")
      {
        button.style.color = "white";
      }
    }
  }
}
function mytable6()
{
  for (let i=1; i<=9; i++)
  {
    var button = document.getElementById(`button${i}`);
    var mytable = document.getElementById(`mytable${i}`);
    var puzzle = document.getElementById(`puzzle${i}`);
    if(i!=6)
    {
      mytable.style.display = "none";
      puzzle.style.display = "none";
      if(button.style.color != "green")
      {
        button.style.color = "black";
      }
    }
    else
    {
      mytable.style.display = "block";
      puzzle.style.display = "block";
      if(button.style.color != "green")
      {
        button.style.color = "white";
      }
    }
  }
}
function mytable7()
{
  for (let i=1; i<=9; i++)
  {
    var button = document.getElementById(`button${i}`);
    var mytable = document.getElementById(`mytable${i}`);
    var puzzle = document.getElementById(`puzzle${i}`);
    if(i!=7)
    {
      mytable.style.display = "none";
      puzzle.style.display = "none";
      if(button.style.color != "green")
      {
        button.style.color = "black";
      }
    }
    else
    {
      mytable.style.display = "block";
      puzzle.style.display = "block";
      if(button.style.color != "green")
      {
        button.style.color = "white";
      }
    }
  }
}
function mytable8()
{
  for (let i=1; i<=9; i++)
  {
    var button = document.getElementById(`button${i}`);
    var mytable = document.getElementById(`mytable${i}`);
    var puzzle = document.getElementById(`puzzle${i}`);
    if(i!=8)
    {
      mytable.style.display = "none";
      puzzle.style.display = "none";
      if(button.style.color != "green")
      {
        button.style.color = "black";
      }
    }
    else
    {
      mytable.style.display = "block";
      puzzle.style.display = "block";
      if(button.style.color != "green")
      {
        button.style.color = "white";
      }
    }
  }
}
function mytable9()
{
  for (let i=1; i<=9; i++)
  {
    var button = document.getElementById(`button${i}`);
    var mytable = document.getElementById(`mytable${i}`);
    var puzzle = document.getElementById(`puzzle${i}`);
    if(i!=9)
    {
      mytable.style.display = "none";
      puzzle.style.display = "none";
      if(button.style.color != "green")
      {
        button.style.color = "black";
      }
    }
    else
    {
      mytable.style.display = "block";
      puzzle.style.display = "block";
      if(button.style.color != "green")
      {
        button.style.color = "white";
      }
    }
  }
}
let startTime; // 记录游戏加载的起始时间

function startTimer() {
    startTime = new Date(); // 记录加载开始的时间
    updateRuntime(); // 初始化运行时间
    setInterval(updateRuntime, 1000); // 每秒钟更新一次
}
// 记录游戏运行时间
function updateRuntime() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000); // 毫秒转秒

    const hours = Math.floor(elapsedTime / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((elapsedTime % 3600) / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');

    const runtimeElement = document.getElementById('runtime');
    runtimeElement.textContent = `${hours}:${minutes}:${seconds}`;
}
const button = document.querySelector('.button6');
    button.addEventListener('click', function() {
      button.classList.add('animated');
      setTimeout(function() {
        button.classList.remove('animated');
        fun3();
      }, 200);
    });
// 获取模态框和按钮元素
const modal = document.getElementById("codeModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const codeTextarea = document.getElementById("codeTextarea");

// 功能介绍文本
const initialText = `当前页面包含《一键检查》、《一键解题》、《点击提示》、《重新生成》、《提交所有题目》等按钮。下面分别叙述有关功能：
一键检查:玩家点击后会根据数独规则对当前数独题目进行检查，错误处和未填写处标红，正确则标绿；
一键解题:玩家通过点击一次按钮获得本题的标准解答，同时右上角当前题目按钮内的数字变成绿色，且输入格变为不可输入，即变为只读状态；
点击提示:玩家每点击一次该按钮,题目会由左到右,由上到下依次显示一个未填空格中的正确数，或者将错误的数修改成正确数，正确数显示的格子同时变为绿色且数字不可再变动，方便玩家辨认还未解答的空格；
重新生成:玩家通过点击该按钮得到崭新的九道数独题；
提交所有题目:玩家点击该按钮则九道题目全部提交，若有未填写的数独（填写完需点击一键检查查看填写结果正误）则会弹出提示框，若全部填写完毕则会弹出恭喜框；
玩家可以点击右上角九个按键更换题目，点击一个按钮后选好题目后，按钮数字会变成白色，若该题目已经全部填写完毕且正确则按钮数字会变成绿色。`;

// 当点击按钮时显示模态框
openModalBtn.addEventListener("click", function () {
  modal.style.display = "block";
  document.body.classList.add("modal-open"); // 隐藏滚动条
  codeTextarea.value = initialText; // 将初始文本赋值给文本区域
});

// 当点击关闭按钮或模态框背景时隐藏模态框
closeModalBtn.addEventListener("click", function () {
  modal.style.display = "none";
  document.body.classList.remove("modal-open"); // 恢复滚动条
});

// 防止点击模态框内容区域时关闭模态框
modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
    document.body.classList.remove("modal-open"); // 恢复滚动条
  }
});
window.addEventListener('load', startTimer); // 游戏加载完成后开始计时