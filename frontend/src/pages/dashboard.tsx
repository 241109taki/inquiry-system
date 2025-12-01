// import { ticket } from ''

// export const Dashboard = () => {
//     return (
//         <div className="space-y-4 mt-6">
//             <h3 className="text-xl font-semibold">📂 問い合わせ履歴 ({tickets.length}件)</h3>
//             {tickets.length === 0 ? (
//                 <p className="text-gray-500">まだ問い合わせがありません。</p>
//             ) : (
//             <ul className="space-y-4">
//                 {tickets.map((ticket) => (
//                 <li key={ticket.id} className="border p-4 rounded-lg bg-white shadow-sm">
//                     <div className="flex justify-between items-start mb-2">
//                     <h4 className="text-lg font-semibold">{ticket.title}</h4>
//                     <div className="flex items-center gap-2">
//                         <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{ticket.status}</span>
//                         <button 
//                         onClick={() => handleDelete(ticket.id)}
//                         className="text-red-500 text-sm underline hover:text-red-700">
//                             削除
//                         </button>
//                     </div>
//                     </div>
//                     <p className="whitespace-pre-wrap text-gray-700 mb-2">{ticket.content}</p>
//                     <div className="text-xs text-gray-500">
//                         ID: {ticket.id} | 作成日: {new Date(ticket.createdAt).toLocaleString()}
//                     </div>
//                 </li>
//                 ))}
//             </ul>
//             )}
//         </div>
//     )
// }