# BYO LLM Provider + Product RAG + WebMCP — Idea / Architecture Seed

## Status

**Stage:** Idea / exploration  
**Purpose:** Provide a concrete starting point for Codex, Claude, or another coding agent to evolve into an architecture, proof of concept, and eventually an implementation.

This document is intentionally not a final technical specification. The core architectural boundaries should be preserved unless there is a strong reason to change them.

---

# 1. Problem Statement

Build a web-based product that has its own authoritative product knowledge, documentation, structured product data, and potentially business actions.

Users should be able to use AI in two complementary ways:

1. **BYO LLM Provider**
   - The product itself calls an LLM selected and authenticated by the user or customer.
   - Examples:
     - OpenAI API
     - Anthropic API
     - Azure OpenAI
     - AWS Bedrock
     - Google Vertex / Gemini API
     - OpenRouter
     - OpenAI-compatible endpoint
     - self-hosted vLLM
     - self-hosted llama.cpp
     - corporate/private model endpoint

2. **BYO External AI Agent**
   - The user may use an external AI/browser agent that can interact with the product.
   - The product exposes well-defined tools through **WebMCP** and potentially conventional **MCP**.
   - The external agent can retrieve product knowledge and perform authorized product operations without scraping the UI.

The product's own knowledge, authorization rules, RAG logic, citations, and business logic must remain independent of the chosen LLM provider.

---

# 2. Main Architectural Principle

The application owns:

- product knowledge
- structured product data
- retrieval/RAG
- authorization
- tenant isolation
- business rules
- citations/source provenance
- auditability
- tool definitions
- provider configuration
- security policy

The LLM provider owns:

- inference
- reasoning
- text generation
- tool-call selection where supported
- model-specific features

The LLM vendor must **not** become the system of record for product knowledge.

---

# 3. High-Level Architecture

```text
                           USER
                            |
            +---------------+----------------+
            |                                |
            v                                v
   Product's built-in AI             External AI Agent
            |                         / browser agent
            |                                |
            |                              WebMCP
            |                                |
            v                                v
      AI Orchestrator ----------------> Web Application
            |                                |
     +------+-------+                        |
     |              |                        |
     v              v                        |
Knowledge API   LLM Provider Gateway          |
     |              |                        |
     |      +-------+-------+--------+        |
     |      |       |       |        |        |
     |      v       v       v        v        |
     |   OpenAI  Claude   Azure    Custom     |
     |                            / Local      |
     |                                        |
     +----------------<-----------------------+
     |
     +-- Product DB / APIs
     +-- Document store
     +-- Vector index
     +-- Lexical/full-text search
     +-- ACL / tenant filters
     +-- Citation metadata
```

---

# 4. Core Components

## 4.1 Web Application

Responsibilities:

- user authentication
- tenant context
- product UI
- AI chat/assistant UI
- provider configuration UI
- model selection
- WebMCP tool registration
- display of citations and provenance
- display of tool actions/results
- explicit confirmations for sensitive write actions

The browser must not receive long-lived provider secrets unless a future provider integration explicitly requires a secure browser-side OAuth flow.

---

## 4.2 AI Orchestrator

The orchestrator is the product-specific AI control layer.

Responsibilities:

- accept user question/request
- determine relevant product/tenant scope
- choose deterministic RAG vs agentic RAG
- retrieve authoritative context
- expose product tools to capable models
- normalize provider-specific responses
- manage tool-call loops
- enforce maximum iterations/timeouts
- attach citations
- record usage/audit information
- enforce safety and data-egress policies

The orchestrator should not contain provider-specific business logic.

Conceptual interface:

```python
answer = ai.ask(
    user=user,
    question=question,
    provider_connection=selected_provider,
    model=selected_model,
    knowledge_scope={
        "tenant_id": user.tenant_id,
        "product_id": product_id,
    },
)
```

---

# 5. BYO LLM Provider

## 5.1 Provider Types

Initial provider types:

```text
openai
anthropic
azure_openai
openrouter
openai_compatible
```

Possible later providers:

```text
aws_bedrock
google_vertex
gemini
mistral
groq
custom
```

An OpenAI-compatible provider is important because it can cover many local and private endpoints.

Examples:

- llama.cpp server
- vLLM
- corporate inference gateway
- local AI server
- compatible third-party provider

---

## 5.2 Provider Abstraction

Avoid leaking provider SDK concepts into application code.

Example conceptual interface:

```typescript
interface LLMProvider {
  testConnection(): Promise<ProviderStatus>;

  listModels?(): Promise<ModelInfo[]>;

  generate(request: LLMRequest): AsyncIterable<LLMEvent>;
}
```

Normalized request:

```typescript
interface LLMRequest {
  model: string;
  messages: Message[];
  tools?: ToolDefinition[];
  responseSchema?: object;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}
```

Normalized events:

```text
text_delta
tool_call
tool_result
usage
finish
error
```

---

# 6. Provider Gateway

A provider gateway may be implemented directly or by using an existing abstraction layer such as LiteLLM.

Preferred initial approach:

```text
Application
    |
AI Orchestrator
    |
Provider Gateway
    |
    +-- OpenAI
    +-- Anthropic
    +-- Azure OpenAI
    +-- OpenRouter
    +-- OpenAI-compatible
```

Do not hard-wire the architecture to LiteLLM. It should be replaceable.

The application-level provider contract is the stable boundary.

---

# 7. Provider Configuration Model

Example:

```json
{
  "id": "provider_123",
  "tenant_id": "tenant_42",
  "type": "openai",
  "display_name": "Company OpenAI",
  "base_url": null,
  "auth_type": "api_key",
  "credential_reference": "vault://tenant_42/provider_123",
  "default_model": "gpt-example",
  "enabled": true
}
```

OpenAI-compatible example:

```json
{
  "id": "provider_456",
  "tenant_id": "tenant_42",
  "type": "openai_compatible",
  "display_name": "Private Qwen",
  "base_url": "https://ai.company.example/v1",
  "auth_type": "bearer",
  "credential_reference": "vault://tenant_42/provider_456",
  "default_model": "qwen-model",
  "enabled": true
}
```

Never store plaintext secrets directly in normal application database rows.

Use:

```text
credential_reference
```

pointing to a secret store.

Potential authentication types:

```text
api_key
bearer
oauth
azure_entra
aws_iam
none
```

---

# 8. Important Authentication Boundary

Do not assume that a user's consumer subscription to ChatGPT, Claude, or another hosted chat product is equivalent to API access.

Initial supported model should be:

- provider API key
- enterprise cloud identity where supported
- provider-approved OAuth/delegated access where available
- private/local endpoint credentials

Do not:

- scrape consumer web sessions
- copy session cookies
- impersonate a hosted chat UI
- treat a ChatGPT/Claude subscription as an undocumented inference API

WebMCP solves a different problem: it lets an external browser-side agent use the product's tools.

---

# 9. Product Knowledge Layer

The product's knowledge system should be provider-independent.

```text
                    Knowledge Service
                           |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v
 Structured data      Document retrieval     Live systems
 Product DB/API       Vector + lexical       ERP/PIM/etc.
```

Do not vectorize data simply because an LLM will use it.

Use structured APIs for authoritative structured information.

Examples:

```text
get_product(product_id)
get_product_specification(product_id)
find_compatible_products(...)
get_firmware_compatibility(...)
```

Use document retrieval for:

```text
manuals
installation guides
technical notes
release notes
service bulletins
FAQ
product descriptions
support articles
```

---

# 10. RAG Architecture

Preferred retrieval pipeline:

```text
question
   |
query interpretation/rewrite
   |
   +---------------------+
   |                     |
vector retrieval     lexical retrieval
   |                     |
   +----------+----------+
              |
         metadata filter
              |
         tenant / ACL filter
              |
            rerank
              |
          top evidence
              |
          citations
```

Potential storage:

- PostgreSQL + pgvector
- Qdrant
- Elasticsearch/OpenSearch
- another search engine if justified

Start simple. PostgreSQL + pgvector + full-text search is sufficient for many initial products.

---

# 11. Authorization Rules for RAG

Authorization must be enforced by the retrieval layer, not by the model.

Correct:

```python
results = knowledge.search(
    query=query,
    filters={
        "tenant_id": authenticated_user.tenant_id,
        "product_id": product_id,
    },
    permissions=authenticated_user.permissions,
)
```

Incorrect:

```text
Search all documents
       |
       v
Ask LLM which documents the user may see
```

All search operations must enforce:

- tenant isolation
- product-level scope
- document ACLs where applicable
- user/role permissions
- environment/data-classification policy

---

# 12. Citation Model

Every retrieved fragment should carry provenance.

Example:

```json
{
  "document_id": "manual-2026-04",
  "chunk_id": "manual-2026-04:p42:3",
  "title": "Product X Installation Manual",
  "text": "...",
  "page": 42,
  "section": "External Sensors",
  "source_uri": "/documents/manual-2026-04",
  "revision": "2026-04",
  "score": 0.92
}
```

The final answer should preserve enough information to produce trustworthy citations.

Citations should point to product-owned sources, not to the LLM provider.

---

# 13. Two RAG Modes

## 13.1 Deterministic RAG

The application retrieves context before calling the model.

```text
question
   |
retrieve
   |
rerank
   |
context
   |
LLM
```

Use when:

- high reliability is required
- product support
- compliance
- manuals
- technical specification answers
- provider/model has weak tool support

---

## 13.2 Agentic RAG

The model receives product tools and decides when to call them.

Example tools:

```text
search_product_knowledge
get_product
get_product_specifications
get_compatibility
get_release_notes
```

Use for multi-step questions.

Example:

```text
User:
"Will Product A with firmware 3.4 work with Controller B?"

Agent:
1. get_product(Product A)
2. get_firmware_compatibility(Product A, 3.4)
3. get_product(Controller B)
4. search_product_knowledge(...)
5. answer with citations
```

The orchestrator must limit loops and enforce authorization independently of the model.

---

# 14. Product Tool Contract

Tools should expose business semantics, not storage mechanics.

Bad:

```text
vector_search(
  embedding,
  collection,
  cosine_threshold,
  top_k
)
```

Good:

```text
search_product_knowledge(
  query,
  product_id?,
  topic?,
  document_types?
)
```

Other useful tools:

```text
get_product(product_id)
get_product_specifications(product_id)
get_compatibility(product_a, product_b)
get_firmware_compatibility(product_id, version)
get_release_notes(product_id, version?)
compare_products(product_ids)
```

Future write tools:

```text
create_configuration(...)
save_project(...)
request_quote(...)
create_support_case(...)
```

Write/destructive operations should have explicit authorization and confirmation semantics.

---

# 15. WebMCP

WebMCP is complementary to BYO LLM providers.

BYO provider:

```text
Your product -> user's selected LLM
```

WebMCP:

```text
User's external AI/browser agent -> your product
```

The web application can register structured tools that invoke the product's normal authenticated APIs.

Conceptual example:

```javascript
document.modelContext.registerTool({
  name: "search_product_knowledge",

  description:
    "Search authoritative product documentation and technical knowledge.",

  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string" },
      productId: { type: "string" }
    },
    required: ["query"]
  },

  annotations: {
    readOnlyHint: true
  },

  execute: async ({ query, productId }) => {
    const response = await fetch("/api/knowledge/search", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        productId
      })
    });

    if (!response.ok) {
      throw new Error(`Knowledge search failed: ${response.status}`);
    }

    return response.json();
  }
});
```

Important:

- WebMCP tools use the product's existing browser authentication/session.
- The external model does not need database credentials.
- The external model does not need direct vector-store access.
- Authorization remains in the backend.
- WebMCP is not a substitute for provider API integration.

---

# 16. Conventional MCP

Consider exposing the same business capabilities through a regular MCP server.

Possible MCP tools:

```text
search_product_knowledge
get_product
get_product_specifications
get_compatibility
get_release_notes
```

Architecture:

```text
                         Knowledge Service
                                |
              +-----------------+------------------+
              |                 |                  |
              v                 v                  v
           REST API            MCP               WebMCP
              |                 |                  |
          own product       external AI       browser agents
```

Internal communication does not need MCP if direct API/function calls are simpler.

MCP should be treated primarily as an external integration contract.

---

# 17. REST API Sketch

## Provider configuration

```text
GET    /api/ai/providers
POST   /api/ai/providers
GET    /api/ai/providers/{id}
PATCH  /api/ai/providers/{id}
DELETE /api/ai/providers/{id}

POST   /api/ai/providers/{id}/test
GET    /api/ai/providers/{id}/models
```

## Chat / generation

```text
POST /api/ai/chat
POST /api/ai/chat/stream
```

Example:

```json
{
  "provider_id": "provider_123",
  "model": "model-name",
  "conversation_id": "conv_456",
  "message": "Can Product X use two external sensors?",
  "context": {
    "product_id": "product_x"
  }
}
```

## Knowledge

```text
POST /api/knowledge/search
GET  /api/products/{id}
GET  /api/products/{id}/specifications
GET  /api/products/{id}/compatibility
GET  /api/products/{id}/documents
```

---

# 18. Suggested Backend Data Model

Minimum entities:

```text
Tenant
User
Role
Permission

LLMProviderConnection
LLMProviderCredentialReference
LLMModelPreference

Product
ProductSpecification
ProductCompatibility
ProductVersion

Document
DocumentRevision
DocumentChunk
DocumentACL

Conversation
ConversationMessage
ToolExecution
Citation

AIUsageRecord
AuditEvent
```

---

# 19. Model Capability Registry

Different models/providers have different capabilities.

Track capabilities separately from provider names.

Example:

```json
{
  "provider": "example-provider",
  "model": "example-model",
  "capabilities": {
    "streaming": true,
    "tools": true,
    "vision": true,
    "json_schema": true,
    "reasoning": true,
    "embeddings": false,
    "max_context_tokens": 200000
  }
}
```

The orchestrator can then choose behavior:

```text
tools supported?
   |
   +-- yes -> agentic RAG available
   |
   +-- no  -> deterministic RAG + context injection
```

Do not maintain large brittle hard-coded model lists if capability discovery can be done dynamically.

---

# 20. Security Requirements

BYO provider support introduces significant security concerns.

## Secrets

Requirements:

- never return stored provider secrets through normal APIs
- encrypt secrets at rest
- use a dedicated secrets manager where practical
- redact keys from logs
- redact Authorization headers
- never expose secrets in browser HTML
- isolate credentials per tenant
- support credential rotation

---

## SSRF

Custom provider endpoints are an SSRF risk.

Do not blindly allow arbitrary URLs.

Protect against access to:

```text
localhost
127.0.0.0/8
::1
169.254.0.0/16
cloud metadata endpoints
internal database hosts
internal control planes
private ranges unless explicitly allowed
```

Potential controls:

- URL validation
- DNS resolution validation
- outbound proxy
- egress allowlists
- per-tenant private-endpoint policy
- explicit admin approval for private networks
- reject redirects to prohibited networks

---

## Data Egress

The system must know what content is permitted to leave the platform.

Potential policy:

```text
public product docs     -> external provider allowed
internal docs           -> tenant-approved providers only
confidential docs       -> private/local providers only
restricted data         -> no LLM egress
```

This policy should be enforced before context is sent to an LLM.

---

# 21. Observability

Capture:

```text
request id
tenant
user
provider
model
latency
input token estimate
output token count
cost estimate
RAG sources used
tool calls
errors
finish reason
```

Do not log:

```text
provider API keys
Authorization headers
raw secrets
sensitive document content unless policy explicitly permits it
```

Useful later:

- per-provider success rate
- latency comparison
- model quality evaluation
- retrieval quality
- hallucination/evidence metrics
- cost by tenant/user/provider
- tool failure rate

---

# 22. Suggested Initial Stack

This is a starting point, not a hard requirement.

## Backend

```text
Python
FastAPI
Pydantic
SQLAlchemy
```

## Database

```text
PostgreSQL
pgvector
```

Start with PostgreSQL full-text search for lexical retrieval.

Introduce Qdrant/OpenSearch only if scale or retrieval quality demonstrates a need.

## Provider gateway

Option A:

```text
LiteLLM
```

Option B:

Implement a small internal provider interface with official SDK adapters.

Prefer Option A for a PoC unless it causes architectural constraints.

## Frontend

Any existing product frontend stack.

If starting fresh:

```text
React / Next.js
```

## Secrets

For local development:

```text
encrypted local/dev secret mechanism
```

Production candidates:

```text
HashiCorp Vault
AWS Secrets Manager
Azure Key Vault
GCP Secret Manager
```

---

# 23. Suggested Repository Structure

```text
src/
  api/
    ai.py
    providers.py
    knowledge.py
    products.py

  ai/
    orchestrator.py
    models.py
    events.py

    providers/
      base.py
      litellm_provider.py
      openai.py
      anthropic.py
      openai_compatible.py

    tools/
      registry.py
      product_tools.py
      knowledge_tools.py

  knowledge/
    service.py
    retrieval.py
    reranker.py
    citations.py
    ingestion.py
    chunking.py

  products/
    service.py
    repository.py
    models.py

  security/
    auth.py
    permissions.py
    secrets.py
    egress_policy.py
    endpoint_validation.py

  webmcp/
    tool_manifest.py

  mcp/
    server.py

  observability/
    usage.py
    audit.py
    metrics.py

tests/
```

If frontend and backend are separated:

```text
apps/
  web/
  api/

packages/
  contracts/
  webmcp/
  mcp/

infra/
```

---

# 24. Initial Proof of Concept

The first PoC should prove the architectural boundaries, not implement every feature.

## PoC scope

Implement:

1. single-user/local application
2. two LLM provider types:
   - OpenAI
   - OpenAI-compatible endpoint
3. provider connection test
4. configurable model name
5. basic secrets abstraction
6. sample product catalog
7. ingest Markdown/PDF-derived text
8. PostgreSQL + pgvector retrieval
9. simple hybrid retrieval if practical
10. `search_product_knowledge`
11. deterministic RAG
12. source citations
13. optional tool-calling mode
14. one WebMCP read-only tool
15. minimal audit/usage logging

Do not initially implement:

- billing
- full enterprise tenancy
- ten provider SDKs
- complex workflow engine
- autonomous write actions
- distributed vector database
- elaborate agent framework
- Kubernetes
- custom model training

---

# 25. Suggested PoC Flow

```text
1. User opens application

2. User configures:
   Provider: OpenAI-compatible
   URL:      http://localhost:8000/v1
   Model:    local-model
   Key:      ...

3. User asks:
   "Does Product X support Sensor Y?"

4. Backend determines:
   product = Product X
   tenant = current tenant

5. Knowledge service retrieves:
   product specs
   manual chunks
   compatibility records

6. Orchestrator creates evidence context

7. Selected BYO model generates answer

8. Application renders:
   answer
   citations
   provider/model used

9. Same knowledge search is exposed as WebMCP tool

10. A compatible external browser agent can call:
    search_product_knowledge(...)
```

---

# 26. Design Decisions to Preserve

Unless testing proves otherwise:

## Keep RAG provider-independent

Do not make OpenAI File Search, Anthropic-specific retrieval, or another vendor-managed RAG system the authoritative product knowledge layer.

Vendor-specific retrieval may later be supported as an optional adapter.

---

## Keep authentication server-side

Provider secrets should normally live in the backend/secret store.

---

## Keep authorization outside the model

The model must never decide whether a user has permission to retrieve a document.

---

## Keep WebMCP and BYO Provider conceptually separate

```text
BYO Provider:
Product -> LLM

WebMCP:
External agent -> Product
```

Both can share the same Knowledge API and tool definitions.

---

## Prefer semantic product tools

Expose:

```text
get_product_specifications
```

instead of:

```text
run_sql
```

Expose:

```text
search_product_knowledge
```

instead of:

```text
query_vector_database
```

---

# 27. Future Possibilities

Potential later features:

- OAuth-based provider authorization where officially supported
- organization-wide provider configurations
- user-level provider overrides
- model routing
- fallback providers
- cost-aware routing
- latency-aware routing
- private-model-only policies
- provider health checks
- embedding-provider selection
- reranker selection
- cross-encoder reranking
- multilingual retrieval
- query decomposition
- tool approval policies
- WebMCP write actions
- conventional MCP server
- OpenAPI-generated tools
- evaluations
- prompt/version registry
- product configuration assistant
- support case assistant
- quote/proposal generation
- multimodal product manuals
- image/manual diagram retrieval
- local/private deployment

---

# 28. Open Questions

These should be answered during design rather than assumed.

1. Is the product multi-tenant from day one?
2. Are provider credentials user-level, tenant-level, or both?
3. Can a tenant administrator restrict allowed providers/models?
4. Can product data be sent to public SaaS LLMs?
5. Do different document classes have different egress policies?
6. Should embeddings be generated centrally or by customer-selected providers?
7. Is PostgreSQL + pgvector sufficient for expected scale?
8. Is hybrid retrieval required from the first version?
9. Is reranking required?
10. Should the product expose a standalone MCP server?
11. Which browsers/agents currently support the desired WebMCP workflow?
12. Which WebMCP APIs are stable enough for production use?
13. What write operations, if any, should external agents be able to perform?
14. How should confirmation be handled for side-effecting tools?
15. How should citations link back into the product UI?
16. Should conversation history be stored by the product?
17. What is the retention policy for AI requests and retrieved evidence?
18. Is provider-side data retention acceptable?
19. Are users allowed to configure arbitrary private LLM endpoints?
20. How will usage/cost limits be enforced?

---

# 29. Instructions for a Coding Agent

When continuing from this document:

1. Do not immediately build a large framework.
2. First review the architecture and identify assumptions.
3. Preserve the separation between:
   - provider gateway
   - AI orchestration
   - knowledge/RAG
   - authorization
   - WebMCP/MCP
4. Prefer small, replaceable interfaces.
5. Avoid provider-specific logic outside provider adapters.
6. Make local OpenAI-compatible endpoints a first-class use case.
7. Treat custom endpoint URLs as security-sensitive.
8. Build authorization into the retrieval service from the beginning.
9. Every RAG result should retain citation/provenance metadata.
10. Add tests around tenant/ACL isolation before sophisticated agent behavior.
11. Keep WebMCP tools thin; they should call the same backend APIs used by the main application.
12. Do not allow WebMCP to become a second implementation of business logic.
13. Avoid unnecessary dependencies and agent frameworks.
14. Document architectural decisions as ADRs once implementation choices are made.

---

# 30. Suggested First Agent Task

A coding agent should start by producing:

```text
docs/
  architecture.md
  adr/
    0001-provider-abstraction.md
    0002-provider-independent-rag.md
    0003-webmcp-boundary.md
    0004-secret-storage.md

prototype/
  README.md
```

Then implement a minimal vertical slice:

```text
Configure provider
      |
Test provider
      |
Ask question
      |
Retrieve product evidence
      |
Call selected LLM
      |
Return cited answer
```

Only after this works should WebMCP be added to expose `search_product_knowledge()` to an external browser agent.

---

# 31. Success Criteria for the Idea

The architecture is successful if the following are true:

- switching OpenAI to Claude does not require changing RAG
- switching to a local OpenAI-compatible model does not require changing product logic
- product knowledge remains authoritative regardless of model
- citations remain traceable to product-owned sources
- unauthorized data cannot enter RAG results
- provider credentials never leak to the browser or logs
- external agents can use product knowledge through a stable tool contract
- WebMCP and MCP reuse existing backend services
- no AI provider becomes a hard dependency of the product
- an organization can eventually enforce which providers are allowed

---

# 32. Short Architectural Summary

```text
                 YOUR PRODUCT
                      |
              AI Orchestrator
               /           \
              /             \
     Product Knowledge    LLM Gateway
          / | \              |
         /  |  \        user's provider
        /   |   \
      DB   RAG  APIs
       \
        \---- REST / MCP / WebMCP
```

**Key rule:** the LLM is replaceable; product knowledge, permissions, and business behavior are not.

---

# 33. Applied to eendraadschema: AREI Compliance Verifier

This section grounds the generic template above in this repository's actual concrete use case —
the "AREI compliance verifier, LLM-backed" idea in
[`improvements-backlog.md`](./improvements-backlog.md) (item 17) — so the two documents stay
consistent instead of drifting apart as separate, loosely-linked ideas.

## 33.1 Concept mapping

| Generic template concept | eendraadschema equivalent |
|---|---|
| Tenant | **Does not apply.** eendraadschema is a single-user, browser-local, no-server-in-production tool (per `CLAUDE.md`) — there is no multi-tenant backend today. Any BYO-provider config is per-installation (browser `localStorage`/local config file), not per-tenant. This is the biggest real deviation from the template — sections 7, 11, and the `tenant_id` filters throughout section 9–13 should be read as "single local user," not dropped silently. |
| Product / `product_id` | The open **dossier** — the single authoritative `Hierarchical_List` document (one EDS file at a time). |
| Product knowledge (structured data) | The dossier itself, already exposed exactly the way section 4.2/14 wants ("expose business semantics, not storage mechanics"): `get_dossier_summary`, `list_circuits`, `get_item`, `find_items` already exist as MCP tools in `BrowserMcpBridge.ts`/`scripts/eds-mcp.mjs`, unchanged. |
| Product knowledge (document retrieval / RAG) | **New**: the AREI regulation text itself (2025/2026 editions, and older editions for grandfathered parts — see 33.3) is the "manuals/technical notes" layer from section 9. This doesn't exist yet in any form. |
| `search_product_knowledge(...)` | **New tool**, same shape as section 14's example: `search_arei_regulations(query, edition?, topic?)`. |
| Citation model (section 12) | Maps directly: a compliance finding should cite the specific AREI article/edition it's based on, the same way section 12 wants document/page/section provenance — this matters more here than in the generic template, since compliance advice without a citable rule reference is close to useless to an installer. |
| WebMCP (section 15) — external agent calling into the product | **Already implemented**, just not via the browser-native WebMCP API: `BrowserMcpBridge.ts` + `scripts/eds-mcp.mjs` already let an external MCP client (this session's own workflow) read the live dossier and propose changes through `propose_change_set`, gated by the same kind of explicit human-in-the-loop approval section 15 calls for ("The external model does not need database credentials," "Authorization remains in the backend" → here, "remains behind the in-browser `McpProposalReview.tsx` approval gate"). No new work needed for this direction. |
| BYO LLM Provider (section 5) | **The actual new piece.** Nothing like this exists in eendraadschema today — this is what the compliance verifier idea in the backlog is really asking for. |
| Write tools (section 14, "Future write tools") | Compliance findings should almost certainly stay **read-only advice**, surfaced as annotations/warnings on circuits — not an agent empowered to silently "fix" a document's compliance issues via `propose_change_set`. If auto-fix is ever wanted, it should go through the exact same proposal/approval flow as every other document edit, never a separate privileged path. |

## 33.2 What this narrows the PoC scope to (vs. section 24)

Given the "does not apply" on tenancy, and that structured product data already has a working MCP
surface, the eendraadschema-specific PoC (section 24/25) shrinks to essentially two new pieces:

1. A BYO-provider config surface (section 5–8, unmodified) — local-only, no tenant dimension.
2. `search_arei_regulations` backed by a small document store of AREI text (section 9–13's RAG
   pipeline, but against a single fixed, versioned corpus rather than per-tenant documents) — plus the
   per-circuit "approved under edition X" attribution called out in `improvements-backlog.md` item 17,
   which is a **prerequisite** for `search_arei_regulations` to even know which edition to check a
   given circuit against.

Everything else in the generic template (provider gateway abstraction, secrets handling, SSRF/egress
policy for custom endpoints, capability registry) applies unchanged and doesn't need re-deriving for
this use case.

## 33.3 The still-open question this doesn't answer

Section 33.1's "does not apply" on tenancy assumes eendraadschema stays a local, no-backend tool. If
item 19 in the backlog (the broader Python-backend platform rework) ever actually happens, that
assumption should be re-checked before building the compliance verifier on top of it — a real backend
might reintroduce a tenancy question (e.g. one installer managing several clients' dossiers) that this
mapping currently assumes away.

