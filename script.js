document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addMemo');
    const shuffleButton = document.getElementById('shuffleButton');
    const memoContainer = document.getElementById('memoContainer');
    let memoCount = 0;
    const MAX_MEMOS = 10;

    addButton.addEventListener('click', createNewMemo);
    shuffleButton.addEventListener('click', shuffleMemos);

    function createNewMemo() {
        if (memoCount >= MAX_MEMOS) {
            alert('최대 10개의 메모지만 생성할 수 있습니다.');
            return;
        }

        const memo = document.createElement('div');
        memo.className = 'memo';
        memo.style.left = '50%';
        memo.style.top = '50%';
        memo.style.transform = 'translate(-50%, -50%)';

        const memoFront = document.createElement('div');
        memoFront.className = 'memo-front';

        const textarea = document.createElement('textarea');
        textarea.placeholder = '메모를 입력하세요...';

        const completeButton = document.createElement('button');
        completeButton.className = 'complete-button';
        completeButton.textContent = '완료';
        completeButton.addEventListener('click', () => completeMemo(memo));

        const memoBack = document.createElement('div');
        memoBack.className = 'memo-back';

        const memoCover = document.createElement('div');
        memoCover.className = 'memo-cover hidden';

        memoFront.appendChild(textarea);
        memoFront.appendChild(completeButton);
        memo.appendChild(memoFront);
        memo.appendChild(memoBack);
        memo.appendChild(memoCover);
        memoContainer.appendChild(memo);
        memoCount++;

        textarea.focus();
    }

    function completeMemo(memo) {
        const textarea = memo.querySelector('textarea');
        if (!textarea.value.trim()) {
            alert('메모를 입력해주세요.');
            return;
        }

        const randomX = Math.random() * (window.innerWidth - 200);
        const randomY = Math.random() * (window.innerHeight - 200);
        const randomRotate = (Math.random() * 30) - 15;

        memo.style.width = '160px';
        memo.style.height = '160px';
        memo.style.left = `${randomX}px`;
        memo.style.top = `${randomY}px`;
        memo.style.transform = `rotate(${randomRotate}deg)`;
        textarea.readOnly = true;
        memo.querySelector('.complete-button').remove();

        // 클릭 이벤트 추가
        memo.addEventListener('click', () => {
            if (!memo.classList.contains('flipped')) {
                memo.classList.add('flipped');
            } else {
                memo.classList.remove('flipped');
            }
        });
    }

    function shuffleMemos() {
        const memos = document.querySelectorAll('.memo');
        if (memos.length === 0) return;

        // 모든 메모 뒤집기
        memos.forEach(memo => {
            memo.classList.add('flipped');
        });

        // 중앙으로 모으기
        setTimeout(() => {
            memos.forEach(memo => {
                memo.classList.add('centered');
                const cover = memo.querySelector('.memo-cover');
                cover.classList.remove('hidden');
            });

            // 하나씩 뒤집기
            setTimeout(() => {
                let delay = 0;
                memos.forEach(memo => {
                    setTimeout(() => {
                        memo.classList.remove('flipped');
                        memo.classList.remove('centered');
                        
                        const randomX = Math.random() * (window.innerWidth - 160);
                        const randomY = Math.random() * (window.innerHeight - 160);
                        const randomRotate = (Math.random() * 30) - 15;
                        
                        memo.style.left = `${randomX}px`;
                        memo.style.top = `${randomY}px`;
                        memo.style.transform = `rotate(${randomRotate}deg)`;

                        // 클릭 이벤트 수정
                        memo.addEventListener('click', function handleClick() {
                            const cover = this.querySelector('.memo-cover');
                            if (cover && !cover.classList.contains('hidden')) {
                                cover.classList.add('hidden');
                                this.removeEventListener('click', handleClick);
                            }
                        });
                    }, delay);
                    delay += 300;
                });
            }, 1000);
        }, 1000);
    }
}); 