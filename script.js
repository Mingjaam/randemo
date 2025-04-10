document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addMemo');
    const shuffleButton = document.getElementById('shuffleButton');
    const memoContainer = document.getElementById('memoContainer');
    let memoCount = 0;
    const MAX_MEMOS = 10;
    let isDragging = false;
    let currentMemo = null;
    let offsetX, offsetY;

    addButton.addEventListener('click', createNewMemo);
    shuffleButton.addEventListener('click', shuffleMemos);

    // 드래그 관련 이벤트 리스너
    document.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    function startDrag(e) {
        if (e.target.closest('.memo') && !e.target.classList.contains('delete-button')) {
            const memo = e.target.closest('.memo');
            if (memo.classList.contains('flipped')) return;

            isDragging = true;
            currentMemo = memo;
            
            const rect = memo.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            memo.style.cursor = 'grabbing';
            memo.style.zIndex = '1000';
        }
    }

    function drag(e) {
        if (!isDragging || !currentMemo) return;
        
        e.preventDefault();
        
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        
        currentMemo.style.left = `${x}px`;
        currentMemo.style.top = `${y}px`;
        currentMemo.style.transform = currentMemo.style.transform.replace(/translate\([^)]*\)/, '');
    }

    function endDrag() {
        if (isDragging && currentMemo) {
            currentMemo.style.cursor = 'grab';
            currentMemo.style.zIndex = '1';
            isDragging = false;
            currentMemo = null;
        }
    }

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
        memo.style.cursor = 'grab';

        const memoFront = document.createElement('div');
        memoFront.className = 'memo-front';

        const textarea = document.createElement('textarea');
        textarea.placeholder = '메모를 입력하세요...';

        const completeButton = document.createElement('button');
        completeButton.className = 'complete-button';
        completeButton.textContent = '완료';
        completeButton.addEventListener('click', () => completeMemo(memo));

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '×';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            memo.remove();
            memoCount--;
        });

        const memoBack = document.createElement('div');
        memoBack.className = 'memo-back';

        const memoCover = document.createElement('div');
        memoCover.className = 'memo-cover hidden';

        memoFront.appendChild(textarea);
        memoFront.appendChild(completeButton);
        memoFront.appendChild(deleteButton);
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
        memo.addEventListener('click', (e) => {
            // 삭제 버튼 클릭 시에는 수정하지 않음
            if (e.target.classList.contains('delete-button')) {
                return;
            }

            if (!memo.classList.contains('flipped')) {
                // 메모지가 앞면일 때
                if (textarea.readOnly) {
                    textarea.readOnly = false;
                    textarea.focus();
                } else {
                    textarea.readOnly = true;
                }
            } else {
                // 메모지가 뒷면일 때
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