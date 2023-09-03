<script>
export default {
  name: "export",
  methods: {
    download: function downloadByBlob(data, fileType = 'xls', fileName = 'export') {
      if(!data) {
        return
      }
      try {
        let url = window.URL.createObjectURL(data);
        let eleLink = document.createElement('a');
        eleLink.href = url;
        eleLink.download = `${fileName}.${fileType}`;
        document.body.appendChild(eleLink);
        eleLink.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('download function error!', error);
      }
    },
  }
}
</script>