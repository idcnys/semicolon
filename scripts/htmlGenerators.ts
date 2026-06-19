export const getResponsiveHTML = (fileId: string, fileType: string): string => {
    if (fileType === 'pdf') {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <style>
                    html, body { margin: 0; padding: 0; width: 100%; height: 100%; background-color: #f5f5f5; overflow: hidden; }
                    .pdf-container { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: #f5f5f5; }
                    iframe { width: 100%; height: 100%; border: none; background: #ffffff; }
                </style>
            </head>
            <body>
                <div class="pdf-container">
                    <iframe src="https://drive.google.com/file/d/${fileId}/preview" allowfullscreen></iframe>
                </div>
            </body>
            </html>
        `;
    }

    if (fileType === 'image') {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <style>
                    html, body { margin: 0; padding: 0; width: 100%; height: 100%; background-color: #fffefe; display: flex; justify-content: center; align-items: center; overflow: hidden; }
                    img { max-width: 100%; max-height: 100%; object-fit: contain; }
                </style>
            </head>
            <body>
                <img src="https://lh3.googleusercontent.com/d/${fileId}" alt="Image Preview" />
            </body>
            </html>
        `;
    }

    if (fileType === 'video') {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <style>
                    html, body { margin: 0; padding: 0; width: 100%; height: 100%; background-color: #121212; overflow: hidden; }
                    .video-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
                    iframe { width: 100%; height: 100%; border: none; }
                </style>
            </head>
            <body>
                <div class="video-wrapper">
                    <iframe src="https://drive.google.com/file/d/${fileId}/preview" allow="autoplay; fullscreen" allowfullscreen></iframe>
                </div>
            </body>
            </html>
        `;
    }

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <style>
                html, body { margin: 0; padding: 0; width: 100%; height: 100%; background-color: #121212; overflow: hidden; }
                iframe { width: 100%; height: 100%; border: none; }
            </style>
        </head>
        <body>
            <iframe src="https://drive.google.com/file/d/${fileId}/preview" allowfullscreen sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>
        </body>
        </html>
    `;
};