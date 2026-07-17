document.addEventListener('DOMContentLoaded', () => {
    const helloScreen = document.getElementById('hello-screen');
    const mainContent = document.getElementById('main-content');
    const typingTextEl = document.getElementById('helloTypingText');
    
    if (helloScreen) {
        // Disable scroll/interactions while hello screen is visible
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
        
        // Typing animation logic
        if (typingTextEl) {
            const textToType = "Я IT-специалист. У меня 5+ лет опыта.<br><br>Это сайт моей Студии. Помогаю бизнесу с цифровыми решениями.<br><br>Ознакомьтесь с сайтом, чтобы узнать подробнее!";
            let i = 0;
            const typingSpeed = 60; // ms per char (slower)
            
            // Fade in second video just before typing starts
            setTimeout(() => {
                const bgVideo2 = document.getElementById('bgVideo2');
                if (bgVideo2) {
                    bgVideo2.currentTime = 0;
                    bgVideo2.play();
                    bgVideo2.style.opacity = '1';
                }
            }, 6500);

            setTimeout(() => {
                function typeWriter() {
                    if (i < textToType.length) {
                        if (textToType.charAt(i) === '<') {
                            let tag = '';
                            while(textToType.charAt(i) !== '>' && i < textToType.length) {
                                tag += textToType.charAt(i);
                                i++;
                            }
                            tag += '>';
                            typingTextEl.innerHTML += tag;
                            i++;
                        } else {
                            typingTextEl.innerHTML += textToType.charAt(i);
                            i++;
                        }
                        setTimeout(typeWriter, typingSpeed);
                    }
                }
                typeWriter();
            }, 6800); // Start earlier, right as block fades in
        }
        
        // Animate text out before revealing the site
        setTimeout(() => {
            const typingContainer = document.getElementById('helloTypingContainer');
            if (typingContainer) {
                typingContainer.classList.add('fade-out-text');
            }
        }, 16000);

        setTimeout(() => {
            helloScreen.classList.add('hidden');
            
            // Show main content with cinematic reveal
            if (mainContent) {
                mainContent.classList.add('visible');
            }

            // Fade to third video for the main site + stylish blur overlay
            const bgVideo3 = document.getElementById('bgVideo3');
            const bgVideo3b = document.getElementById('bgVideo3b');
            const video3Overlay = document.getElementById('video3Overlay');
            if (bgVideo3 && bgVideo3b) {
                bgVideo3.currentTime = 0;
                bgVideo3.play();
                bgVideo3.style.opacity = '1';
                
                let activeVideo = 1;
                const LOOP_TIME = 5.3; // Loop at 5.3 seconds
                const CROSSFADE_DURATION = 1.0; // 1 second crossfade
                const TRIGGER_TIME = LOOP_TIME - CROSSFADE_DURATION;
                
                const checkLoop = () => {
                    if (activeVideo === 1 && bgVideo3.currentTime >= TRIGGER_TIME) {
                        activeVideo = 2;
                        bgVideo3b.currentTime = 0;
                        bgVideo3b.play();
                        bgVideo3b.style.opacity = '1';
                        bgVideo3.style.opacity = '0';
                    } else if (activeVideo === 2 && bgVideo3b.currentTime >= TRIGGER_TIME) {
                        activeVideo = 1;
                        bgVideo3.currentTime = 0;
                        bgVideo3.play();
                        bgVideo3.style.opacity = '1';
                        bgVideo3b.style.opacity = '0';
                    }
                };

                bgVideo3.addEventListener('timeupdate', checkLoop);
                bgVideo3b.addEventListener('timeupdate', checkLoop);

                if (video3Overlay) video3Overlay.style.opacity = '1';
            }
            
            // Re-enable scroll for the main block
            document.body.style.overflow = 'auto';
            
            // Start dynamic notifications
            if (mainContent) {
                setTimeout(spawnNotification, 2000);
                setInterval(spawnNotification, 10000);
            }
            
            // Smooth background music fade-in
            const bgMusic = document.getElementById('bgMusic');
            const soundIconOn = document.getElementById('soundIconOn');
            const soundIconOff = document.getElementById('soundIconOff');
            if (bgMusic) {
                const playAudioWithFade = () => {
                    bgMusic.volume = 0;
                    const playPromise = bgMusic.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            if (soundIconOn && soundIconOff) {
                                soundIconOn.style.display = 'block';
                                soundIconOff.style.display = 'none';
                            }
                            let vol = 0;
                            const fadeInterval = setInterval(() => {
                                if (vol < 0.95) {
                                    vol += 0.05;
                                    bgMusic.volume = vol;
                                } else {
                                    bgMusic.volume = 1;
                                    clearInterval(fadeInterval);
                                }
                            }, 150);
                        }).catch(err => {
                            console.log('Autoplay prevented, waiting for click', err);
                            // Only click, keydown, touchstart are valid user activations for audio
                            const startOnInteract = () => {
                                bgMusic.volume = 0;
                                bgMusic.play().then(() => {
                                    if (soundIconOn && soundIconOff) {
                                        soundIconOn.style.display = 'block';
                                        soundIconOff.style.display = 'none';
                                    }
                                    let vol = 0;
                                    const fadeInterval = setInterval(() => {
                                        if (vol < 0.95) {
                                            vol += 0.05;
                                            bgMusic.volume = vol;
                                        } else {
                                            bgMusic.volume = 1;
                                            clearInterval(fadeInterval);
                                        }
                                    }, 150);
                                }).catch(e => console.log(e));
                                
                                ['click', 'touchstart', 'keydown'].forEach(evt => 
                                    document.removeEventListener(evt, startOnInteract)
                                );
                            };
                            ['click', 'touchstart', 'keydown'].forEach(evt => 
                                document.addEventListener(evt, startOnInteract)
                            );
                        });
                    }
                };
                playAudioWithFade();
            }

            // Wait for fade out to remove from DOM
            setTimeout(() => {
                helloScreen.style.display = 'none';
            }, 2000);
        }, 17500); // 17.5 seconds total before revealing site
    }

    // Dynamic Notification System
    const notifyData = [
        { title: "Seacode Studio", body: "Вау! Так можно было?", color: "notify-blue" },
        { title: "Автоматизация", body: "Работает без границ", color: "notify-coral" },
        { title: "Ваш бизнес", body: "Полный контроль 24/7", color: "notify-amber" },
        { title: "Процессы", body: "Ускорены в 3 раза", color: "notify-teal" },
        { title: "Конверсия", body: "+40% за первый месяц", color: "notify-blue" }
    ];

    function spawnNotification() {
        const data = notifyData[Math.floor(Math.random() * notifyData.length)];
        
        const popup = document.createElement('div');
        popup.className = `notify-popup ${data.color}`;

        // Icon
        const icon = document.createElement('div');
        icon.className = 'notify-icon';
        const iconImg = document.createElement('img');
        iconImg.src = 'data/notify.png';
        icon.appendChild(iconImg);
        popup.appendChild(icon);

        // Text block
        const textBlock = document.createElement('div');
        textBlock.className = 'notify-text';

        const title = document.createElement('div');
        title.className = 'notify-title';
        title.innerText = data.title;
        textBlock.appendChild(title);

        const body = document.createElement('div');
        body.className = 'notify-body';
        body.innerText = data.body;
        textBlock.appendChild(body);

        popup.appendChild(textBlock);

        // Time
        const time = document.createElement('div');
        time.className = 'notify-time';
        time.innerText = 'сейчас';
        popup.appendChild(time);

        // Progress
        const progress = document.createElement('div');
        progress.className = 'notify-progress';
        progress.style.animationDuration = '6s';
        popup.appendChild(progress);

        // Position — right side, random height
        const positions = [
            { top: '120px', right: '30px' },
            { top: '35%', right: '35px' },
            { bottom: '25%', right: '30px' },
            { bottom: '80px', right: '40px' }
        ];
        const pos = positions[Math.floor(Math.random() * positions.length)];
        if (pos.top) popup.style.top = pos.top;
        if (pos.bottom) popup.style.bottom = pos.bottom;
        popup.style.right = pos.right;

        document.body.appendChild(popup);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                popup.classList.add('show');
            });
        });

        setTimeout(() => {
            popup.classList.remove('show');
            popup.classList.add('hide');
            setTimeout(() => popup.remove(), 600);
        }, 6000);
    }

    // Audio Logic
    const soundToggleBtn = document.getElementById('soundToggle');
    const bgMusic = document.getElementById('bgMusic');
    const soundIconOn = document.getElementById('soundIconOn');
    const soundIconOff = document.getElementById('soundIconOff');

    if (soundToggleBtn && bgMusic) {
        soundToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent triggering document click
            if (bgMusic.paused) {
                bgMusic.play();
                soundIconOn.style.display = 'block';
                soundIconOff.style.display = 'none';
            } else {
                bgMusic.pause();
                soundIconOn.style.display = 'none';
                soundIconOff.style.display = 'block';
            }
        });
    }
    // ============================================
    // IPHONE HERO INTERACTION
    // ============================================
    const iosHelloScreen = document.getElementById('iosHelloScreen');
    if (iosHelloScreen) {
        iosHelloScreen.addEventListener('click', () => {
            iosHelloScreen.classList.add('hidden');
        });
    }

    const launchAppBtn = document.getElementById('launchVideoApp');
    const videoAppScreen = document.getElementById('videoAppScreen');
    const closeAppBtn = document.getElementById('closeVideoApp');
    const heroVideoContainer = document.getElementById('heroVideoContainer');

    const vkIframeHTML = `<iframe src="https://vk.ru/video_ext.php?oid=-240296655&id=456239019&hash=6f7cdad885e0f647&autoplay=1" width="100%" height="100%" frameborder="0" allowfullscreen="1" style="background-color: #000; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 40px;" allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>`;

    if (launchAppBtn && videoAppScreen && closeAppBtn && heroVideoContainer) {
        launchAppBtn.addEventListener('click', () => {
            videoAppScreen.classList.add('active');
            heroVideoContainer.innerHTML = vkIframeHTML;
        });

        closeAppBtn.addEventListener('click', () => {
            videoAppScreen.classList.remove('active');
            heroVideoContainer.innerHTML = ''; // Stop video by removing iframe
        });
    }

});
