// $(function () {
//     const monthNames = ["January18", "February18", "March18", "April18", "May18", "June18",
//         "July18", "August18", "aug-18", "October18", "November18", "December18"
//     ];
//     var currentSubscription = monthNames[(new Date()).getMonth()];
//     $("#validate").click(function (e) {
//         event.preventDefault();

//         var userName = 'lucas';
//         var password = 'lucas';
//         var userNameBox = document.getElementById('username').value;
//         var passwordBox = document.getElementById('password').value;
//         if (userNameBox === userName && passwordBox === password) {
//             alert(' it is working')
//             // if (!web3 || !web3.eth)
//             //     return;
//             // // var signer = '0xd3e4265540e0730ad0d247381b88416cf32d4e19';
//             // var signer = web3.eth.accounts[0];
//             // var original_message = "Verify my account";
//             // var message = ethUtil.bufferToHex(new Buffer(original_message, 'utf8'))

//             // web3.personal.sign(message, signer, function (err, res) {
//             //     if (err) {
//             //         alert("Fail to signin, please try again later");
//             //         return;
//             //     }
//             //     var data = {
//             //         publicKey: signer,
//             //         sign: res
//             //     };
//             //     smartContract.hasRole(signer, currentSubscription).then((response) => {
//             //         if (response && response[0]) {
//             //             sessionStorage.setItem("userLogIn", "true");
//             //             $.post("signin", data, function (data) {
//             //                 if (data) {
//             //                     window.location.href = '/myItems';
//             //                 } else {
//             //                     alert("Fail to signin, please try again later");
//             //                 }

//             //             });
//             //         } else {
//             //             window.location.href = '/subscription';
//             //         }
//             //     });

//             // });
//         } else {
//             alert('Please enter a valid login and password')
//         }
//     })
// });