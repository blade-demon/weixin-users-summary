(function ($) {

  $(document).ready(function () {
    var editor = new $.fn.dataTable.Editor({
      ajax: {
        create: {
          type: 'POST',
          url: "/api/users"
        },
        edit: {
          type: 'PATCH',
          url: "/api/users/_id_"
        },
        delete: {
          type: 'DELETE',
          url: "/api/users/_id_"
        }
      },
      table: "#dataTable",
      idSrc: '_id',
      fields: [{
        label: "微信信息:",
        name: "weixinInfo"
      }, {
        label: "微信id:",
        name: "unionid"
      }, {
        label: "近7天积分:",
        name: "scoreOf7Days"
      }, {
        label: "累计积分:",
        name: "totalScore"
      }]
    });

    var table = $('#dataTable').DataTable({
      dom: "Bfrtip",
      renderer: "bootstrap",
      ajax: {
        url: "/api/users/formatted",
        dataSrc: ""
      },
      columns: [{
        data: null,
        render: function (data, type, row) {
          if (data) {
            return `<span> ${data.nickname} </span><img class="headimg" src="${data.headimg}">`;
          }
        }
      }, {
        data: "nickname"
      },{
        data: "scoreOf7Days"
      }, {
        data: "totalScore"
      }
      ],
      select: true,
      buttons: [
        {extend: "create", text: '新建', editor: editor},
        {extend: "edit", text: '修改', editor: editor},
        {extend: "remove", text: '删除', editor: editor},
        {
          extend: 'collection',
          text: '导出文件',
          buttons: [
            'excel'
          ]
        }
      ]
    });
    // // editor.on('open', function() {
    // //     alert('Form displayed!');
    // // });
    // editor.on('close', function() {
    //     alert('Form closed');
    //     table.draw();
    // });
    // editor.on('submit', function() {
    //     alert('Form submitted');
    // });

    // editor.on('create', function(e, json, data) {
    //     alert('New row added');
    // });
    // editor.on('edit', function(e, json, data) {
    //     alert(data);
    //     alert('The row edited');
    // });
  });
}(jQuery));


// var getData = function() {
//     return axios.get('/api/users').then(function(response) {
//         console.log(response.data.length);
//         // insertDataIntoTable(response.data);
//     }).catch(function(error) {
//         console.log(error);
//     });
// };


// var insertDataIntoTable = function(data) {
//     let html = "";
//     for (let i = 0; i < data.length; i++) {
//         html += `
//         <tr>
//           <td>${data[i].nickname}</td>
//           <td><img src=${data[i].headimg} class="headimg"></img></td>
//           <td>${data[i].unionid}</td>
//           <td>${data[i].score}</td>
//         </tr>
//       `;
//     }
//     $('#dataTable tbody').html(html);
//     $('#dataTable').DataTable({});

// };