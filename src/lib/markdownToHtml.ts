import { remark } from "remark";
import html from "remark-html";
import Prism from 'prismjs';

export default async function markdownToHtml(markdown: string) {
  try {
    
    require('prismjs/components/prism-javascript');
    require('prismjs/components/prism-typescript');
    require('prismjs/components/prism-css');
    require('prismjs/components/prism-jsx');
    require('prismjs/components/prism-tsx');
    require('prismjs/components/prism-bash');
    require('prismjs/components/prism-json');
    require('prismjs/components/prism-markdown');
    
    // Função para destacar o código com Prism
    const highlightCode = (htmlString: string) => {
      // Regex para encontrar blocos de código
      const codeBlockRegex = /<pre><code class="([^"]+)">([^<]+)<\/code><\/pre>/g;
      
      return htmlString.replace(
        codeBlockRegex,
        (match, language, code) => {
          // Decodifica entidades HTML no código
          const decodedCode = code
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
          
          // Extrai o nome da linguagem (remove 'language-' se presente)
          const lang = language.replace(/^language-/, '');
          
          try {
            // Verifica se o Prism suporta esta linguagem
            if (Prism.languages[lang]) {
              // Destaca o código com Prism
              const highlighted = Prism.highlight(
                decodedCode, 
                Prism.languages[lang], 
                lang
              );
              
              // Retorna o HTML com o código destacado
              return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
            }
          } catch (e) {
            console.warn(`Erro ao destacar código ${lang}:`, e);
          }
          
          // Fallback: retorna o bloco original se algo falhar
          return `<pre class="language-${lang}"><code class="language-${lang}">${code}</code></pre>`;
        }
      );
    };

    // Processa o markdown com remark
    const result = await remark()
      .use(html, { sanitize: false })
      .process(markdown);
    
    // Destaca o código com Prism
    const highlightedHtml = highlightCode(result.toString());
    
    return highlightedHtml;
  } catch (error) {
    console.error("Erro ao processar markdown:", error);
    
    // Fallback: se algo falhar, usamos apenas o remark-html básico
    try {
      const fallbackResult = await remark()
        .use(html, { sanitize: false })
        .process(markdown);
        
      return fallbackResult.toString();
    } catch (fallbackError) {
      console.error("Erro no fallback:", fallbackError);
      return `<p>Erro ao processar o markdown. Por favor, tente novamente mais tarde.</p>`;
    }
  }
}
