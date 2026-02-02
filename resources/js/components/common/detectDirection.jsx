export default function detectDirection(text) {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicRegex.test(text) ? 'rtl' : 'ltr';
};


{/* 
                          How is it works
<div dir={detectDirection(post.content)}>
  {post.content}
</div>

*/}