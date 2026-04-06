---
title: 研究主題整理
tags:
  - research-idea
---

# RAG For the Thesis Domain
- Base on the RAG workflow for NCL
    - Using the Thesis paper as the mainly dataset. 
    - ![image](https://hackmd.io/_uploads/ryxSFqMRjZx.png)
    - In the conclusion, for the NCL final practice, we found that the workflow without Hyde method will become better. 

In my opinion : 
The mainly innovation of pinyi is using different **"channel"** of data engineering to do **"data augmentation"**.

Like Indexing the Documents with different methods like sparse and dense, and in the dense indexing methods, she use the Hyde(make fake abstract to make sure the abstracts length are close), Dense(embedding model), Query index(make hypothesis query for documents) .

**I GUESS SOMETHINGS MAYBE WORK**
### Make the workflow with the **knowledge graph** 
- Using the LLM ot extract the keywords or some NER technique to make a **KG**(**K**nowledge **G**raph).
- Maybe can refer to the HippoRAG v1.

### Enhance the Benchmark

