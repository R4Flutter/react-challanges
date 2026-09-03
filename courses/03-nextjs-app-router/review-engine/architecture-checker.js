import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

/**
 * Checks architecture patterns using AST parsing
 * Adapted for Next.js App Router patterns
 */
export async function checkArchitecture(challengeMetadata, projectDir) {
  const patternsRequired = challengeMetadata.patternsRequired || [];
  const filesToCheck = challengeMetadata.filesToCheck || [];
  
  if (patternsRequired.length === 0) {
    return {
      score: 100,
      passed: true,
      details: []
    };
  }

  const results = {
    score: 0,
    passed: false,
    patternsFound: [],
    patternsMissing: [],
    details: []
  };

  let totalChecks = 0;
  let passedChecks = 0;

  for (const file of filesToCheck) {
    const filePath = join(projectDir, file);
    
    if (!existsSync(filePath)) {
      results.details.push({
        file,
        error: 'File does not exist',
        patternsFound: [],
        patternsMissing: patternsRequired
      });
      continue;
    }

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const fileResults = checkFileForPatterns(fileContent, patternsRequired, file);
      
      totalChecks += patternsRequired.length;
      passedChecks += fileResults.patternsFound.length;
      
      results.patternsFound.push(...fileResults.patternsFound);
      results.patternsMissing.push(...fileResults.patternsMissing);
      results.details.push({
        file,
        patternsFound: fileResults.patternsFound,
        patternsMissing: fileResults.patternsMissing
      });
    } catch (error) {
      results.details.push({
        file,
        error: error.message,
        patternsFound: [],
        patternsMissing: patternsRequired
      });
    }
  }

  // Calculate score
  results.score = totalChecks > 0 
    ? Math.round((passedChecks / totalChecks) * 100 * 10) / 10
    : 0;
  
  results.passed = results.score >= 80;

  return results;
}

function checkFileForPatterns(content, patternsRequired, fileName) {
  const patternsFound = [];
  const patternsMissing = [];

  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties']
    });

    const foundPatterns = new Set();

    // Pre-scan for string-based patterns (some patterns are easier to detect via simple text matching)
    if (/['"]use client['"]/.test(content)) {
      foundPatterns.add('useClient');
      foundPatterns.add('clientComponent');
    }
    if (/['"]use server['"]/.test(content)) {
      foundPatterns.add('useServer');
      foundPatterns.add('serverAction');
    }
    if (/from\s+['"]next\/link['"]/.test(content)) {
      foundPatterns.add('Link');
    }
    if (/from\s+['"]next\/navigation['"]/.test(content)) {
      foundPatterns.add('navigation');
    }
    if (/from\s+['"]next\/image['"]/.test(content)) {
      foundPatterns.add('nextImage');
    }
    if (/from\s+['"]next\/font/.test(content)) {
      foundPatterns.add('nextFont');
    }
    if (/from\s+['"]@reduxjs\/toolkit['"]/.test(content)) {
      foundPatterns.add('reduxToolkit');
    }
    if (/from\s+['"]react-redux['"]/.test(content)) {
      foundPatterns.add('reactRedux');
    }
    if (/configureStore\s*\(/.test(content)) {
      foundPatterns.add('configureStore');
    }
    if (/createApi\s*\(/.test(content)) {
      foundPatterns.add('createApi');
    }
    if (/fetchBaseQuery\s*\(/.test(content)) {
      foundPatterns.add('fetchBaseQuery');
    }
    if (/use(Get|Post|Put|Delete|Patch)\w*Query\b/.test(content)) {
      foundPatterns.add('useQuery');
    }
    if (/use(Get|Post|Put|Delete|Patch|Add|Update)\w*Mutation\b/.test(content)) {
      foundPatterns.add('useMutation');
    }
    if (/\buseSelector\s*\(/.test(content)) {
      foundPatterns.add('useSelector');
    }
    if (/\buseDispatch\s*\(/.test(content)) {
      foundPatterns.add('useDispatch');
    }
    if (/<Provider\b/.test(content) || /Provider\s+store=/.test(content)) {
      foundPatterns.add('Provider');
    }
    if (/\bnotFound\s*\(/.test(content)) {
      foundPatterns.add('notFound');
    }
    if (/export\s+(default\s+)?function\s+(Error|GlobalError|NotFound)\b/.test(content) || /error\.tsx['"]/.test(fileName) || /error\.jsx['"]/.test(fileName) || /not-found\.tsx['"]/.test(fileName)) {
      foundPatterns.add('errorTsx');
    }
    if (/export\s+const\s+dynamic\s*=/.test(content)) {
      foundPatterns.add('dynamicExport');
      if (/['"]force-dynamic['"]/.test(content)) {
        foundPatterns.add('forceDynamic');
        foundPatterns.add('forceStaticOrDynamic');
      }
      if (/['"]force-static['"]/.test(content)) {
        foundPatterns.add('forceStatic');
        foundPatterns.add('forceStaticOrDynamic');
      }
    }
    if (/cache:\s*['"]no-store['"]/.test(content)) {
      foundPatterns.add('cacheNoStore');
    }
    if (/revalidate\s*[:=]\s*\d+/.test(content) || /next:\s*\{\s*revalidate/.test(content)) {
      foundPatterns.add('fetchCache');
      foundPatterns.add('revalidate');
    }
    if (/\brevalidatePath\s*\(/.test(content) || /\brevalidateTag\s*\(/.test(content)) {
      foundPatterns.add('revalidatePath');
      foundPatterns.add('revalidateTag');
      foundPatterns.add('revalidate');
    }
    if (/\.middleware/.test(content) || /\bapi\.middleware\b/.test(content)) {
      foundPatterns.add('apiMiddleware');
    }
    if (/\[id\]|\[slug\]|\[\.\.\./.test(fileName) || /generateStaticParams|params\.|\bparams\s*:\s*\{/.test(content)) {
      foundPatterns.add('dynamicSegment');
    }
    if (/\bsearchParams\b/.test(content)) {
      foundPatterns.add('searchParams');
    }
    if (/\bloading\.tsx['"]/.test(fileName) || /\bloading\.jsx['"]/.test(fileName) || /<Suspense\b/.test(content)) {
      foundPatterns.add('loadingTsx');
    }
    if (/^\s*(GET|POST|PUT|DELETE|PATCH)\s*:?\s*(\(|async\s*\()/m.test(content) || /export\s+(?:async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH)\b/.test(content)) {
      foundPatterns.add('routeHandler');
      foundPatterns.add('GET');
    }
    if (/Response\.json\s*\(|NextResponse\.json\s*\(/.test(content) || /\.json\s*\(/.test(content)) {
      foundPatterns.add('ResponseJson');
    }

    traverse(ast, {
      // Check for 'use client' directive (AST-level backup)
      Directive(path) {
        if (path.node.value.value === 'use client') {
          foundPatterns.add('useClient');
          foundPatterns.add('clientComponent');
        }
        if (path.node.value.value === 'use server') {
          foundPatterns.add('useServer');
          foundPatterns.add('serverAction');
        }
      },

      // Check for Server Component (no 'use client'), app directory, page-based routing
      Program(path) {
        const hasUseClient = path.node.directives?.some(
          d => d.value.value === 'use client'
        );
        if (!hasUseClient && fileName.includes('page.tsx')) {
          foundPatterns.add('serverComponent');
        }
        if (fileName.includes('app/')) {
          foundPatterns.add('appDirectory');
        }
        if (fileName.includes('page.tsx')) {
          foundPatterns.add('fileBasedRouting');
        }
        if (fileName.includes('route.ts') || fileName.includes('route.js')) {
          foundPatterns.add('routeHandler');
        }
        if (fileName.includes('error.tsx') || fileName.includes('error.jsx') || fileName.includes('not-found.tsx') || fileName.includes('not-found.jsx') || fileName.includes('loading.tsx') || fileName.includes('loading.jsx')) {
          foundPatterns.add('errorTsx');
          foundPatterns.add('loadingTsx');
        }
        if (/\[id\]|\[slug\]|\[\.\.\./.test(fileName)) {
          foundPatterns.add('dynamicSegment');
        }
      },

      // Check for Link component, navigation
      ImportDeclaration(path) {
        if (path.node.source.value === 'next/link') {
          foundPatterns.add('Link');
        }
        if (path.node.source.value === 'next/navigation') {
          foundPatterns.add('navigation');
        }
        if (path.node.source.value === 'next/image') {
          foundPatterns.add('nextImage');
        }
        if (path.node.source.value && path.node.source.value.startsWith('next/font')) {
          foundPatterns.add('nextFont');
        }
        if (path.node.source.value === '@reduxjs/toolkit') {
          foundPatterns.add('reduxToolkit');
        }
        if (path.node.source.value === 'react-redux') {
          foundPatterns.add('reactRedux');
        }
      },

      // Check for async component (Server Component data fetching)
      FunctionDeclaration(path) {
        if (path.node.async) {
          foundPatterns.add('asyncComponent');
        }
        if (path.node.id?.name && /^(GET|POST|PUT|DELETE|PATCH)$/.test(path.node.id.name)) {
          foundPatterns.add(path.node.id.name);
          foundPatterns.add('routeHandler');
        }
      },

      ArrowFunctionExpression(path) {
        if (path.node.async) {
          foundPatterns.add('asyncComponent');
        }
      },

      // Check for metadata export
      ExportNamedDeclaration(path) {
        if (path.node.declaration) {
          const decl = path.node.declaration;
          if (decl.id && decl.id.name === 'metadata') {
            foundPatterns.add('metadata');
          }
        }
        path.node.specifiers.forEach(spec => {
          if (spec.exported.name === 'metadata') {
            foundPatterns.add('metadata');
          }
        });
      },

      // Check for API route (route.ts)
      CallExpression(path) {
        if (path.node.callee.name === 'NextResponse') {
          foundPatterns.add('apiRoute');
        }
        if (path.node.callee.name === 'configureStore') {
          foundPatterns.add('configureStore');
        }
        if (path.node.callee.name === 'createApi') {
          foundPatterns.add('createApi');
        }
        if (path.node.callee.name === 'fetchBaseQuery') {
          foundPatterns.add('fetchBaseQuery');
        }
        if (path.node.callee.name === 'notFound') {
          foundPatterns.add('notFound');
        }
        if (path.node.callee.name === 'revalidatePath') {
          foundPatterns.add('revalidatePath');
        }
        if (path.node.callee.name === 'revalidateTag') {
          foundPatterns.add('revalidateTag');
        }
        if (path.node.callee.name === 'useSelector') {
          foundPatterns.add('useSelector');
        }
        if (path.node.callee.name === 'useDispatch') {
          foundPatterns.add('useDispatch');
        }
        if (path.node.callee.object &&
            path.node.callee.object.name === 'Response' &&
            path.node.callee.property &&
            path.node.callee.property.name === 'json') {
          foundPatterns.add('apiRoute');
          foundPatterns.add('ResponseJson');
        }
      },

      // Check for Server Actions
      FunctionDeclaration(path) {
        if (path.node.async &&
            (path.node.id?.name?.includes('action') ||
             content.includes('use server'))) {
          foundPatterns.add('serverAction');
        }
      },

      // Check for form handling
      JSXElement(path) {
        if (path.node.openingElement.name.name === 'form') {
          foundPatterns.add('formHandling');
        }
        if (path.node.openingElement.name.name === 'Provider') {
          foundPatterns.add('Provider');
        }
      }
    });

    // Check which required patterns were found
    for (const pattern of patternsRequired) {
      if (foundPatterns.has(pattern)) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }

  } catch (error) {
    // If parsing fails, try simple string matching as fallback
    for (const pattern of patternsRequired) {
      if (content.includes(pattern) || content.includes(pattern.replace(/([A-Z])/g, '-$1').toLowerCase())) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }
  }

  return { patternsFound, patternsMissing };
}
