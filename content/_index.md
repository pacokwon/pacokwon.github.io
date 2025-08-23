+++
template = "homepage.html"
+++

<style>
.homepage {
    margin-top: 5rem;
    text-align: center;
    padding: 2rem 0;
}

img.homepage-profile {
    border-radius: 50%;
    max-width: 16rem;
    width: 100%;
    height: auto;
}

h1.homepage-name {
    font-family: var(--header-font);
    font-weight: bold;
    font-size: 3rem;
    margin-top: 1rem;
    margin-bottom: 0;
}

h1.homepage-name::before {
    content: none;
}

.homepage-nickname {
    font-weight: bold;
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.homepage-subtitle {
    font-size: 1.25rem;
    margin-bottom: 1rem;

</style>

<div class="homepage">
    <img class="homepage-profile" src="https://github.com/pacokwon.png" />
    <h1 class="homepage-name">Haechan Kwon</h1>
    <p class="homepage-nickname">pacokwon</p>
    <p class="homepage-subtitle">
        Undergraduate student at KAIST CS
        <br />
        Interested in Web, Programming Languages and Software Tooling
    </p>
</div>
