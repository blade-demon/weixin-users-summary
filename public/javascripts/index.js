(function ($) {
  var operationIds = [];
  $(document).ready(function () {
    var editor = new $.fn.dataTable.Editor({
      ajax: {
        create: {
          type: 'POST',
          url: "/api/users"
        },
        edit: {
          type: 'PATCH',
          url: "/api/users/_id_",
          data: function (d) {
            for (let p in d.data) {
              if (d.data["type"] === "空") {
                d.data["type"] = 0;
              }
              if (d.data["type"] === "评论") {
                d.data["type"] = 1;
              }
              if (d.data["type"] === "分享") {
                d.data["type"] = 2;
              }
            }
            return d;
          }
        }
      },
      table: "#dataTable",
      idSrc: '_id',
      // form 数据类型
      fields: [{
        label: "微信头像:",
        name: "headimg"
      }, {
        label: "微信昵称:",
        name: "nickname"
      }, {
        label: "微信id:",
        name: "unionid"
      }, {
        label: "新增积分",
        name: "score"
      }, {
        label: "积分类型",
        name: "type",
        type: "select",
        options: [
          "空",
          "评论",
          "分享"
        ]
      }]
    });

    var table = $('#dataTable').DataTable({
      dom: "Bfrtip",
      ajax: {
        url: "/api/users/formatted",
        dataSrc: ""
      },
      columns: [{
        data: "headimg",
        sortable: false,
        defaultContent: '',
        render: function (data, type, row) {
          if (data) {
            return `<img class="headimg" src="${data}">`;
          }
        }
      }, {
        data: "nickname"
      }, {
        data: "unionid"
      }, {
        data: "scoreOf7Days"
      }, {
        data: "totalScore"
      }
      ],
      select: true,
      buttons: [
        {
          extend: "create",
          text: '新建',
          editor: editor,
          formTitle: function (editor, dt) {
            editor.title("创建新用户");
          },
          formMessage: function (editor, dt) {

          },
          formButtons: [{
            label: '创建',
            fn: function () {
              this.submit(function () {
                table.ajax.reload();
              }, function (error) {
                table.ajax.reload();
              });
            },
          }]
        }, {
          extend: "edit",
          text: '修改',
          editor: editor,
          formTitle: function (editor, dt) {
            var rowData = dt.row({selected: true}).data();
            return '你确定编辑' + rowData.nickname + '的数据么？';
          },
          formButtons: [{
            label: '修改',
            fn: function () {
              this.submit(function () {
                table.ajax.reload();
              }, function (error) {
                alert(error);
              });
            },
          }
          ]
        }, {
          extend: "remove",
          text: '删除',
          editor: editor,
          formTitle: function (editor, dt) {
            editor.title('注意！');
          },
          formMessage: function (editor, dt) {
            var rows = dt.rows({selected: true}).data().map(function (rowData) {
              operationIds.push(rowData._id);
              return rowData.nickname;
            });
            return '你确定要删除数据 ' + rows.join(', ') + '?';
          },
          formButtons: {
            text: '确定',
            action: function () {
              let that = this;
              console.log(operationIds);
              return axios.post('/api/users/delete', {"idArray": operationIds}).then(function (response) {
                console.log("已删除");
                that.close();
                table.ajax.reload();
              }).catch(function (error) {
                console.log(error);
              });
            }
          }
        }, {
          extend: 'collection',
          text: '导出文件',
          buttons: [
            'excel'
          ]
        }
      ]
    });

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