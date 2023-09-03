import {message} from './restMessage'

export function downloadFile(response,fileName,fileType){
    console.log(response,fileName,fileType)
    if (!response) {
        message.error('导出失败！');
        return;
    }
    let blob;
    if(fileType=='zip'){
        blob = new Blob([response], {type: "application/zip"});//response为后端传的流文件
    }else{
        blob = new Blob([response]);//response为后端传的流文件
    }
    let downloadFilename = `${fileName + fileType}`;//设置导出的文件名

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //兼容ie浏览器
        window.navigator.msSaveOrOpenBlob(blob, downloadFilename)
    }else {
        //谷歌,火狐等浏览器
        let url = window.URL.createObjectURL(blob);
        let downloadElement = document.createElement("a");
        downloadElement.style.display = "none";
        downloadElement.href = url;
        downloadElement.download = downloadFilename;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(url);

    }
    message.success('导出成功');

}
