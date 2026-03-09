document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.querySelector(".dropdown");
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const versionText = dropdown.querySelector(".version-text");
    const menuItems = dropdown.querySelectorAll(".dropdown-menu li");
    const downloadBtn = document.querySelector(".download-btn");

    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.carousel-card');

    const pvpCards = document.querySelectorAll('.pvp-card');

    const icons = document.querySelectorAll('.icon');

    icons.forEach(icon => {
        icon.addEventListener('click', function() {
            const ip = this.getAttribute('data-ip');

            navigator.clipboard.writeText(ip).then(() => {
                this.classList.add('copied');

                this.style.pointerEvents = 'none';

                setTimeout(() => {
                    this.classList.remove('copied');
                    this.style.pointerEvents = 'auto';
                }, 2000);

            }).catch(err => {
                const textArea = document.createElement('textarea');
                textArea.value = ip;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                this.classList.add('copied');
                setTimeout(() => {
                    this.classList.remove('copied');
                }, 2000);
            });
        });
    });

    pvpCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });

        card.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    });

    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("open");
    });

    document.addEventListener("click", () => {
        dropdown.classList.remove("open");
    });

    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            const newVersion = item.getAttribute("data-version");
            const currentVersion = versionText.textContent.trim();

            animateVersionChange(currentVersion, newVersion);

            updateDownloadButton(newVersion);

            dropdown.classList.remove("open");
        });
    });

    function animateVersionChange(oldVersion, newVersion) {
        versionText.setAttribute('data-old-version', oldVersion);
        versionText.setAttribute('data-new-version', newVersion);
        versionText.classList.add('animating');

        setTimeout(() => {
            versionText.textContent = newVersion;
            versionText.classList.remove('animating');
        }, 200);
    }

    function updateDownloadButton(version) {
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.href = "downloads/1.21.11/catlean.jar?v=" + Date.now();
            link.download = "catlean_" + version + ".jar";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            fetch('https://api.catlean.su/v1/count', {
                method: 'POST',
            });
        };

        downloadBtn.setAttribute('data-version', version);
    }

    updateDownloadButton(versionText.textContent.trim());

    const lazyVideos = document.querySelectorAll('.gif-img');

    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const source = document.createElement('source');
                source.src = video.getAttribute('data-src');
                source.type = 'video/mp4';

                video.appendChild(source);
                video.load();
                video.classList.add('loaded');

                observer.unobserve(video);
            }
        });
    }, {
        rootMargin: '50px',
        threshold: 0.1
    });

    lazyVideos.forEach(video => videoObserver.observe(video));
});