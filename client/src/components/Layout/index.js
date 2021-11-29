import React from "react";

const Layout = ({children, title}) => {
    return (
        <>
            <head>
                <meta charSet="utf-8"/>
                <title>{title || "Home"} | PERN Ecommerce </title>
                <meta
                    name="description"
                    content="A small full-stack e-commerce project built with Postgres, Express, React and Node."
                />
                <meta
                    name="robots"
                    content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
                />
                <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png"/>
                <link rel="manifest" href="site.webmanifest"/>
                <link rel="mask-icon" href="safari-pinned-tab.svg" color="#400954"/>
                <meta name="msapplication-TileColor" content="#400954"/>
                <meta name="theme-color" content="#400954"/>
                <meta property="og:locale" content="en_US"/>
                <meta property="og:type" content="website"/>
                <meta property="og:title" content="PERN Ecommerce"/>
                <meta
                    property="og:description"
                    content="A small full-stack e-commerce project built with Postgres, Express, React and Node."
                />
                <meta property="og:url" content="https://pernecommerce.herokuapp.com/"/>
                <meta property="og:site_name" content="PERN Ecommerce"/>
                <meta property="og:image" content="android-chrome-512x512.png"/>
                <meta
                    property="og:image:secure_url"
                    content="android-chrome-512x512.png"
                />
                <link rel="canonical" href="https://pernecommerce.herokuapp.com/"/>
            </head>
            <div className="site-wrapper">
                <header className="site-header">
                    <nav>

                    </nav>
                </header>
                <main role="main" className="page-main">
                    <div className="container">
                        {children}
                    </div>
                </main>
                <footer className="site-footer">
                    <p>© 2021 PERN Store —
                        <a
                            href="https://github.com/ivistudia"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            @ivi
                        </a>
                    </p>
                </footer>
            </div>
        </>
    );
};

export default Layout;