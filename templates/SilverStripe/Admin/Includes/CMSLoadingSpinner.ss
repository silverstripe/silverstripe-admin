<div key="spinner" class="cms-content-loading-spinner">
    <div class="spinner">
        <svg
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="512"
        height="297"
        viewBox="0 0 512 297"
        class="spinner__animation"
        >
        <defs>
            <path
            id="spinner__animation__outline_right"
            d="M253 29L145 105C130 115 126 136 137 150C147 165 168 169 183
            159L291 83C335 52 397 63 428 107C459 152 448 214 404 245L370
            268C398 316 461 296 490 245C520 191 519 123 482 70C430 -4 327
            -22 253 29Z"
            />
            <path
            id="spinner__animation__outline_left"
            d="M258 266L366 191C381 180 385 160 374 145C364 130 343 127 328
            137L220 212C176 244 114 233 83 188C52 144 63 82 107 51L141 27C113
            -20 50 -0 21 51C-8 104 -7 172 29 226C81 300 184 318 258 266V266Z"
            />
            <clipPath id="spinner__animation__mask_right">
            <use xlink:href="#spinner__animation__outline_right" />
            </clipPath>
            <clipPath id="spinner__animation__mask_left">
            <use xlink:href="#spinner__animation__outline_left" />
            </clipPath>
        </defs>
        <use
            class="spinner__animation__empty"
            xlink:href="#spinner__animation__outline_left"
        />
        <use
            class="spinner__animation__empty"
            xlink:href="#spinner__animation__outline_right"
        />
        <path
            d="M 379,145 236,242 C 179,282 102,273 62,216 22,159 19,77 76,37 L 135,7"
            class="spinner__animation__fill-left"
            clip-path="url(#spinner__animation__mask_left)"
        />
        <path
            d="M 138,148 281,50 c 57,-39 129,-30 169,26 39,56 41,136 -14,178 l -47,40"
            class="spinner__animation__fill-right"
            clip-path="url(#spinner__animation__mask_right)"
        />
        <path
            d="M253 29L145 105C130 115 126 136 137 150C147 165 168 169 183
            159L291 83C335 52 397 63 428 107C459 152 448 214 404 245L370
            268C398 316 461 296 490 245C520 191 519 123 482 70C430 -4 327
            -22 253 29Z"
        />
        </svg>
    </div>
</div>
