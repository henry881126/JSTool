<template>
  <div>
    <div class="card-wrapper">
      <div class="banner-title-wrapper">
        <div class="banner-title-item-l">
          <span class="dayTime">{{dayTime}}</span>
          <el-button round
                     @click="exportData()"
                     class="custom-btn"
                     icon="el-icon-upload2">导出</el-button>
        </div>

      </div>
      <div class="banner-table-wrapper">
        <el-table v-loading="loading"
                  :data="dayTableData"
                  class="custom-table-n my-custom-table"
                  header-row-class-name="custom-table-header"
                  header-cell-class-name="custom-table-header-cell"
                  cell-class-name="custom-table-cell"
                  row-key="id"
                  :key="1"
                  :border="true"
                  default-expand-all
                  ref="table"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column label="客户名称"
                           prop="customerName"
                           align="left"
                           fixed="left"
                           min-width="380"
                           :show-overflow-tooltip="true"
                           header-align="left">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.contractType==1"
                      class="sale-proxy contractType">代输</span>
                <span v-else-if="scope.row.contractType==2"
                      class="sale-third contractType">代销</span>
                <span v-else-if="scope.row.contractType==3"
                      class="sale-direct contractType">直销</span>
                <span v-else-if="scope.row.contractType==5"
                      class="sale-proxy contractType">多种</span>
                <span v-else
                      class="contractType"></span>
                <span v-if="!scope.row.customerName">-</span>
                <span v-else-if="scope.row.customerName=='null'">-</span>
                <span class="customerName"
                      v-else>{{scope.row.customerName}}</span>
                <!-- <span class="customerName"
                      v-if="scope.row.customerName&&scope.row.customerName.length<20">{{scope.row.customerName}}</span>
                <el-tooltip v-else
                            effect="dark"
                            :content="scope.row.customerName"
                            placement="top-end">
                  <span class="longCustomerName">{{scope.row.customerName}}</span>
                </el-tooltip> -->
              </div>

            </template>
          </el-table-column>
          <el-table-column align="left"
                           header-align="left"
                           label="计划期"
                           :show-overflow-tooltip="true"
                           prop="planPeriod"
                           width="260">
          </el-table-column>
          <el-table-column align="right"
                           header-align="right"
                           label="日指定量(方)"
                           :show-overflow-tooltip="true"
                           prop="dayAllocateGasNum"
                           min-width="150">
          </el-table-column>
          <el-table-column align="right"
                           header-align="right"
                           label="补提量(方)"
                           :show-overflow-tooltip="true"
                           prop="fillGasNum"
                           min-width="150">
          </el-table-column>
          <el-table-column align="right"
                           header-align="right"
                           label="日最大瞬时流量
                            (方/小时)"
                           :show-overflow-tooltip="true"
                           prop="dayInstantaneousGasNum"
                           min-width="150">
          </el-table-column>
          <el-table-column align="right"
                           header-align="right"
                           label="总量(方)"
                           prop="fillGasNumTotal"
                           min-width="150">
            <template slot-scope="scope">
              <div class="fillGasNumTotal"
                   :class="{'twoFillGasNumTotal':scope.row.isChild}">
                <!-- dayExtractionMax 日最大提取量 -->
                <!-- dayAllocateGasNum 日批复量 -->
                <!-- 日批复量大于最大提取量变红 -->
                <!-- <span>日最大提取量{{scope.row.dayExtractionMax}}</span> -->
                <!-- <span>日批复量{{scope.row.dayAllocateGasNum}}</span> -->
                <span class="totalTips"
                      v-if="(scope.row.contractType&&scope.row.dayExtractionMax||scope.row.dayExtractionMax===0)&&(scope.row.fillGasNumTotal>scope.row.dayExtractionMax)">
                  <span class="dayExtractionMax">{{scope.row.fillGasNumTotal}}</span>
                  <el-tooltip class="item"
                              effect="dark"
                              placement="bottom">

                    <div slot="content">{{scope.row.customerName==='null'?'-':scope.row.customerName}}<br />最大日提取量为{{scope.row.dayExtractionMax}}方</div>
                    <img src="../assets/question.png"
                         alt=""
                         class="img"
                         srcset="">
                  </el-tooltip>
                </span>

                <span v-else>
                  {{scope.row.fillGasNumTotal}}
                </span>
              </div>

            </template>
          </el-table-column>
          <el-table-column align="center"
                           header-align="center"
                           label="反馈量(方)"
                           min-width="255"
                           fixed="right"
                           class="handler">

            <template slot-scope="scope">
              <!-- 根据smartReviewStatus和当前登录人 roleCode 判断是否可点击 -->
              <!--smartReviewStatus 0未审核 1已审核 2计划员审核完 3调度中心 4气源贸易群审核中  -->
              <!-- smartReviewStatus 为2 只有3，4可点击 -->
              <!-- roleCode为2 smartReviewStatus只有0可以审核   别的禁灰 -->
              <!-- roleCode为3 smartReviewStatus  只2，3 -->
              <!-- roleCode为4 smartReviewStatus  只2，4 -->
              <!-- 判断是否为多气源，适配样式 -->
              <!-- <div v-if="roleCode==2&&(scope.row.smartReviewStatus==0||scope.row.smartReviewStatus==1||scope.row.smartReviewStatus==2||scope.row.smartReviewStatus==3||scope.row.smartReviewStatus==4)"> -->
              <!-- smartReviewStatus 3,4,34,1 -->
              <!-- {{roleCode}} -->
              <!-- s1. 根据是否为大客户标识来判断多流程 单流程审批 
                    s2. 非大客户 直接单流程审批,并且只能使用计划员审批
                    s3. 大客户：
                        调度中心和气源贸易群审批完成之后,计划员才能审批
                    s4. 之前批复流程作废 -->
              <!-- 0-否, 1-是 -->
              <div v-if="scope.row.isBigCustomer==='1'">
                <div v-if="roleCode==3">
                  <!-- 有子肯定为多气源 -->
                  <div v-if="scope.row.isChild"
                       class="twoLine">
                    <div class="sure-plan">
                      <div v-if="scope.row.smartReviewStatus==0||scope.row.smartReviewStatus==4">
                        <el-input size="mini"
                                  class="input"
                                  width="132"
                                  placeholder="输入批复量"
                                  @input="scope.row.reviewGasNum=scope.row.reviewGasNum.replace(/[^\d]+/g,'')"
                                  v-model="scope.row.reviewGasNum">
                        </el-input>
                        <div class="checkDetail sureHandle"
                             v-if="!scope.row.isChild||scope.row.childIndex==0"
                             :class="{'child':scope.row.isChild}"
                             style="display:inlineBlock;width:5em"
                             @click="confirmApproval(scope.row)">确认批复</div>
                      </div>
                      <div v-else-if="scope.row.smartReviewStatus==3||scope.row.smartReviewStatus==34">
                        <!-- <span v-if="scope.row.smartReviewStatus!=1&&scope.row.childIndex==0"
                            class="checkWaiting"
                            :class="{'child':scope.row.isChild}">审核中</span> -->
                        <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                        <span class="checkDetail waiting"
                              v-if="scope.row.childIndex==0"
                              :class="{'child':scope.row.isChild}"
                              style="margin-left:10px;color:#939599;">审批中</span>
                      </div>
                      <div v-else-if="scope.row.smartReviewStatus==1"
                           class="">
                        <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                        <span v-if="scope.row.smartReviewStatus==1&&scope.row.childIndex==0"
                              class="doneFeedback"
                              :class="{'child':scope.row.isChild}">已反馈</span>

                      </div>
                    </div>
                  </div>
                  <!-- <div v-else-if="!scope.row.hasChild"> -->
                  <div v-else
                       class="oneLine">
                    <div class="singPlan"
                         v-if="scope.row.smartReviewStatus==0||scope.row.smartReviewStatus==4">
                      <el-input size="mini"
                                class="input"
                                width="132"
                                placeholder="输入批复量"
                                @input="scope.row.reviewGasNum=scope.row.reviewGasNum.replace(/[^\d]+/g,'')"
                                v-model="scope.row.reviewGasNum">
                      </el-input>
                      <div class="checkDetail sureHandle"
                           style="marginLeft:10px;width:5em"
                           @click="confirmApproval(scope.row)">确认批复</div>
                    </div>
                    <div v-else-if="scope.row.smartReviewStatus==3||scope.row.smartReviewStatus==34">
                      <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                      <span class="checkDetail waiting"
                            :class="{'child':scope.row.isChild}"
                            style="margin-left:10px;color:#939599;">审批中</span>
                    </div>
                    <div v-else-if="scope.row.smartReviewStatus==1">
                      <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                      <span class="doneFeedback"
                            :class="{'child':scope.row.isChild}"
                            style="margin-left:10px">已反馈</span>
                    </div>
                  </div>
                </div>
                <div v-else-if="roleCode==4">
                  <!-- 有子肯定为多气源 -->
                  <div v-if="scope.row.isChild"
                       class="twoLine">
                    <div class="sure-plan">
                      <div v-if="scope.row.smartReviewStatus==0||scope.row.smartReviewStatus==3">
                        <el-input size="mini"
                                  class="input"
                                  width="132"
                                  placeholder="输入批复量"
                                  @input="scope.row.reviewGasNum=scope.row.reviewGasNum.replace(/[^\d]+/g,'')"
                                  v-model="scope.row.reviewGasNum">
                        </el-input>
                        <div class="checkDetail sureHandle"
                             v-if="!scope.row.isChild||scope.row.childIndex==0"
                             :class="{'child':scope.row.isChild}"
                             style="display:inlineBlock;width:5em"
                             @click="confirmApproval(scope.row)">确认批复</div>
                      </div>
                      <div v-else-if="scope.row.smartReviewStatus==4||scope.row.smartReviewStatus==34">
                        <!-- <span v-if="scope.row.smartReviewStatus!=1&&scope.row.childIndex==0"
                            class="checkWaiting"
                            :class="{'child':scope.row.isChild}">审核中</span> -->
                        <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                        <span class="checkDetail waiting"
                              v-if="scope.row.childIndex==0"
                              :class="{'child':scope.row.isChild}"
                              style="margin-left:10px;color:#939599;">审批中</span>
                      </div>
                      <div v-else-if="scope.row.smartReviewStatus==1"
                           class="">
                        <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                        <span v-if="scope.row.smartReviewStatus==1&&scope.row.childIndex==0"
                              class="doneFeedback"
                              :class="{'child':scope.row.isChild}">已反馈</span>

                      </div>
                    </div>
                  </div>
                  <!-- <div v-else-if="!scope.row.hasChild"> -->
                  <div v-else
                       class="oneLine">
                    <div class="singPlan"
                         v-if="scope.row.smartReviewStatus==0||scope.row.smartReviewStatus==3">
                      <el-input size="mini"
                                class="input"
                                width="132"
                                placeholder="输入批复量"
                                @input="scope.row.reviewGasNum=scope.row.reviewGasNum.replace(/[^\d]+/g,'')"
                                v-model="scope.row.reviewGasNum">
                      </el-input>
                      <div class="checkDetail sureHandle"
                           style="marginLeft:10px;width:5em"
                           @click="confirmApproval(scope.row)">确认批复</div>
                    </div>
                    <div v-else-if="scope.row.smartReviewStatus==4||scope.row.smartReviewStatus==34">
                      <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                      <span class="checkDetail waiting"
                            :class="{'child':scope.row.isChild}"
                            style="margin-left:10px;color:#939599;">审批中</span>
                    </div>
                    <div v-else-if="scope.row.smartReviewStatus==1">
                      <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                      <span class="doneFeedback"
                            :class="{'child':scope.row.isChild}"
                            style="margin-left:10px">已反馈</span>
                    </div>
                  </div>
                </div>
                <div v-else-if="roleCode==2">
                  <div v-if="scope.row.isChild"
                       class="twoLine">
                    <div class="sure-plan">
                      <div v-if="scope.row.smartReviewStatus==34">
                        <el-input size="mini"
                                  class="input"
                                  width="132"
                                  placeholder="输入批复量"
                                  @input="scope.row.reviewGasNum=scope.row.reviewGasNum.replace(/[^\d]+/g,'')"
                                  v-model="scope.row.reviewGasNum">
                        </el-input>
                        <span class="checkDetail sureHandle"
                              v-if="!scope.row.isChild||scope.row.childIndex==0"
                              :class="{'child':scope.row.isChild}"
                              style="width:5em"
                              @click="confirmApproval(scope.row)">确认批复</span>
                      </div>
                      <div v-else-if="scope.row.smartReviewStatus==4||scope.row.smartReviewStatus==3">
                        <!-- <span v-if="scope.row.smartReviewStatus!=1&&scope.row.childIndex==0"
                            class="checkWaiting"
                            :class="{'child':scope.row.isChild}">审核中</span> -->
                        <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                        <span class="checkDetail waiting"
                              v-if="scope.row.childIndex==0"
                              :class="{'child':scope.row.isChild}"
                              style="margin-left:10px;color:#939599;">审批中</span>
                      </div>
                      <div v-else>
                        <div v-if="scope.row.smartReviewStatus==1">
                          <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                          <span class="doneFeedback"
                                v-if="scope.row.childIndex==0"
                                :class="{'child':scope.row.isChild}"
                                style="margin-left:10px">已反馈</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else
                       class="oneLine">
                    <div class="singPlan"
                         v-if="scope.row.smartReviewStatus==34">
                      <el-input size="mini"
                                class="input"
                                width="132"
                                placeholder="输入批复量"
                                @input="scope.row.reviewGasNum=scope.row.reviewGasNum.replace(/[^\d]+/g,'')"
                                v-model="scope.row.reviewGasNum">
                      </el-input>
                      <span class="checkDetail sureHandle"
                            style="display:inlineBlock;width:5em"
                            @click="confirmApproval(scope.row)">确认批复</span>
                    </div>
                    <div v-else-if="scope.row.smartReviewStatus==3||scope.row.smartReviewStatus==4">
                      <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                      <span class="checkDetail waiting"
                            :class="{'child':scope.row.isChild}"
                            style="margin-left:10px;color:#939599;">审批中</span>
                    </div>
                    <div v-else-if="scope.row.smartReviewStatus==1">
                      <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                      <span class="doneFeedback"
                            :class="{'child':scope.row.isChild}"
                            style="margin-left:10px">已反馈</span>
                    </div>
                  </div>
                </div>
                <div v-else
                     class="twolineEmpty">
                  <div v-if="scope.row.isChild"
                       class="twoLine">
                    <div class="sure-plan">
                      <div v-if="scope.row.smartReviewStatus==0">
                        -
                      </div>
                      <div v-else-if="scope.row.smartReviewStatus==3||scope.row.smartReviewStatus==4||scope.row.smartReviewStatus==34">
                        <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                        <span class="checkDetail waiting"
                              v-if="scope.row.childIndex==0"
                              :class="{'child':scope.row.isChild}"
                              style="margin-left:10px;color:#939599;">审批中</span>
                      </div>
                      <div v-else-if="scope.row.smartReviewStatus==1"
                           class="">
                        <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                        <span v-if="scope.row.smartReviewStatus==1&&scope.row.childIndex==0"
                              class="doneFeedback"
                              :class="{'child':scope.row.isChild}">已反馈</span>

                      </div>
                    </div>
                  </div>
                  <div v-else
                       class="oneLine">
                    <div class="singPlan"
                         v-if="scope.row.smartReviewStatus==0">
                    </div>
                    <div v-else-if="scope.row.smartReviewStatus==3||scope.row.smartReviewStatus==4||scope.row.smartReviewStatus==34">
                      <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                      <span class="checkDetail waiting"
                            :class="{'child':scope.row.isChild}"
                            style="margin-left:10px;color:#939599;">审批中</span>
                    </div>
                    <div v-else-if="scope.row.smartReviewStatus==1">
                      <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                      <span class="doneFeedback"
                            :class="{'child':scope.row.isChild}"
                            style="margin-left:10px">已反馈</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="scope.row.isBigCustomer==='0'">
                <div v-if="roleCode==2&&(scope.row.smartReviewStatus==0)">
                  <div v-if="scope.row.isChild"
                       class="twoLine">
                    <div class="sure-plan">
                      <div v-if="scope.row.smartReviewStatus==0">
                        <el-input size="mini"
                                  class="input"
                                  width="132"
                                  placeholder="输入批复量"
                                  @input="scope.row.reviewGasNum=scope.row.reviewGasNum.replace(/[^\d]+/g,'')"
                                  v-model="scope.row.reviewGasNum">
                        </el-input>
                        <span class="checkDetail sureHandle"
                              v-if="!scope.row.isChild||scope.row.childIndex==0"
                              :class="{'child':scope.row.isChild}"
                              style="width:5em"
                              @click="confirmApproval(scope.row)">确认批复</span>
                      </div>
                      <div v-else>
                        <div v-if="scope.row.smartReviewStatus==1">
                          <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                          <span class="doneFeedback"
                                v-if="scope.row.childIndex==0"
                                :class="{'child':scope.row.isChild}"
                                style="margin-left:10px">已反馈</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else
                       class="oneLine">
                    <div class="singPlan"
                         v-if="scope.row.smartReviewStatus==0">
                      <el-input size="mini"
                                class="input"
                                width="132"
                                placeholder="输入批复量"
                                @input="scope.row.reviewGasNum=scope.row.reviewGasNum.replace(/[^\d]+/g,'')"
                                v-model="scope.row.reviewGasNum">
                      </el-input>
                      <span class="checkDetail sureHandle"
                            style="display:inlineBlock;width:5em"
                            @click="confirmApproval(scope.row)">确认批复</span>
                    </div>
                    <div v-else-if="scope.row.smartReviewStatus==3||scope.row.smartReviewStatus==4">
                      <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                      <span class="checkDetail waiting"
                            :class="{'child':scope.row.isChild}"
                            style="margin-left:10px;color:#939599;">审批中</span>
                    </div>
                    <div v-else-if="scope.row.smartReviewStatus==1">
                      <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                      <span class="doneFeedback"
                            :class="{'child':scope.row.isChild}"
                            style="margin-left:10px">已反馈</span>
                    </div>
                  </div>
                </div>
                <div v-else
                     class="twolineEmpty">
                  <div v-if="scope.row.isChild"
                       class="twoLine">
                    <div class="sure-plan">
                      <div v-if="scope.row.smartReviewStatus==0">
                        -
                      </div>
                      <div v-else-if="scope.row.smartReviewStatus==3||scope.row.smartReviewStatus==4||scope.row.smartReviewStatus==34">
                        <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                        <span class="checkDetail waiting"
                              v-if="scope.row.childIndex==0"
                              :class="{'child':scope.row.isChild}"
                              style="margin-left:10px;color:#939599;">审批中</span>
                      </div>
                      <div v-else-if="scope.row.smartReviewStatus==1"
                           class="">
                        <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                        <span v-if="scope.row.smartReviewStatus==1&&scope.row.childIndex==0"
                              class="doneFeedback"
                              :class="{'child':scope.row.isChild}">已反馈</span>

                      </div>
                    </div>
                  </div>
                  <div v-else
                       class="oneLine">
                    <div class="singPlan"
                         v-if="scope.row.smartReviewStatus==0">
                    </div>
                    <div v-else-if="scope.row.smartReviewStatus==3||scope.row.smartReviewStatus==4||scope.row.smartReviewStatus==34">
                      <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                      <span class="checkDetail waiting"
                            :class="{'child':scope.row.isChild}"
                            style="margin-left:10px;color:#939599;">审批中</span>
                    </div>
                    <div v-else-if="scope.row.smartReviewStatus==1">
                      <span class="doneFeedbackNum">{{scope.row.reviewGasNum}}</span>
                      <span class="doneFeedback"
                            :class="{'child':scope.row.isChild}"
                            style="margin-left:10px">已反馈</span>
                    </div>
                  </div>
                </div>
              </div>

            </template>
          </el-table-column>
          <el-table-column align="center"
                           header-align="center"
                           label="操作"
                           min-width="90"
                           fixed="right"
                           class="handler">
            <template slot-scope="scope">
              <div v-if="!scope.row.hasChild">
                <div class="checkDetail checkDetailBox"
                     v-if="!scope.row.isChild||scope.row.childIndex==0"
                     :class="{'child':scope.row.isChild}"
                     @click="checkDetail(scope.row)">
                  <span v-if="(scope.row.dayAllocateGasNum=='-')&&(scope.row.fillGasNum=='-')">-</span>
                  <span v-else>查看</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <template slot="empty">
            <div class="empty-wrapper">
              <img src="/static/img/table-data-empty.png"
                   alt="暂无数据"
                   style="margin-top: 10px;">
              <p>暂无数据</p>
            </div>
          </template>
        </el-table>
        <!-- <el-pagination class="custom-page-n pager"
                       background
                       :page-sizes="pager.pageSize"
                       :current-page="pager.currentPage"
                       layout="prev, pager, next"
                       :total="pager.totalPage"
                       @current-change="handlePagerChange">
        </el-pagination> -->
        <el-pagination background
                       class="custom-page-n"
                       style="marginTop:13px;"
                       layout="total, slot, prev, pager, next, sizes"
                       :current-page="pager.currentPage"
                       :page-size="pager.pageSize[0]"
                       :page-sizes="[10,20,30]"
                       :total="pager.totalPage"
                       @current-change="handlePagerChange"
                       @size-change="handleSizeChange"><span style="color:#606266;">当前{{this.dayTableData.length}}条</span></el-pagination>
      </div>
    </div>
    <!-- 单气源 每行查看详情 -->
    <!-- <el-dialog :title="dayRowData.title"
               width="1120px"
               class="gas-dialog"
               :close-on-click-modal="false"
               :visible.sync="dayRowData.show">
      <div class="tableContent">
        <el-table :data="dayRowData.data"
                  :border="true"
                  class="singleTableHeader"
                  width="100%">
          <el-table-column prop="times"
                           label="次数"
                           align="center"
                           header-align="center">
          </el-table-column>
          <el-table-column prop="operateTime"
                           label="上报时间"
                           align="center"
                           header-align="center">
          </el-table-column>
          <el-table-column prop="dayGasNum"
                           align="center"
                           header-align="center"
                           label="日指定量(方)">
          </el-table-column>
          <el-table-column prop="fillGasNum"
                           align="center"
                           header-align="center"
                           label="补提量(方)">
          </el-table-column>
          <el-table-column prop="changeGasReason"
                           label="变更原因"
                           align="center"
                           header-align="center">
          </el-table-column>
          <el-table-column prop="reviewGasNum"
                           label="批复量(方)"
                           align="center"
                           header-align="center">
          </el-table-column>
        </el-table>
      </div>
      <approve-box v-if="approveShow"
                   :approveData="approveData"></approve-box>
    </el-dialog> -->
    <!-- 多气源 每行查看详情 -->
    <el-dialog :title="dayMultipleRowData.title"
               :close-on-click-modal="false"
               width="1280px"
               class="gas-dialog"
               :visible.sync="dayMultipleRowData.show">
      <!-- 每个table只有一行数据 -->
      <div class="tableContent">
        <el-table :data="dayMultipleRowData.data"
                  default-expand-all
                  width="100%"
                  :border="true"
                  class="multipleTable multipleTableHeader">
          <el-table-column prop="times"
                           label="次数"
                           align="center"
                           width="80"
                           header-align="center"
                           type="expand">
            <template slot-scope="scope"
                      v-if="scope.row.children">
              <el-table :data="scope.row.children"
                        class="innerTable"
                        :border="false">
                <el-table-column align="center"
                                 header-align="center"
                                 width="80"
                                 label="placeholder">
                </el-table-column>
                <el-table-column prop="m_gasName"
                                 align="right"
                                 header-align="right"
                                 label="名字">
                </el-table-column>
                <el-table-column prop="m_dayGasNum"
                                 align="right"
                                 header-align="right"
                                 label="日指定量">
                </el-table-column>
                <el-table-column prop="m_fillGasNum"
                                 align="right"
                                 header-align="right"
                                 label="补提量(方)">
                </el-table-column>
                <el-table-column prop="m_changeGasReason"
                                 align="right"
                                 header-align="right"
                                 label="变更原因">
                </el-table-column>
                <el-table-column prop="m_reviewGasNum"
                                 align="right"
                                 header-align="right"
                                 label="批复量(方)">
                </el-table-column>
                <el-table-column prop="m_operateUserPhone"
                                 align="right"
                                 header-align="right"
                                 label="">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="operateTime"
                           label="上报时间"
                           align="right"
                           header-align="left">
          </el-table-column>
          <el-table-column prop="dayGasNum"
                           align="right"
                           header-align="right"
                           label="日批复量(方)">
          </el-table-column>
          <el-table-column prop="fillGasNum"
                           align="right"
                           header-align="right"
                           label="补提量(方)">
          </el-table-column>
          <el-table-column prop="changeGasReason"
                           label="变更原因"
                           align="left"
                           header-align="left">
          </el-table-column>
          <el-table-column prop="reviewGasNum"
                           label="批复量(方)"
                           align="right"
                           header-align="right">
          </el-table-column>
          <el-table-column prop="operateUserPhone"
                           label="上报人联系方式"
                           align="right"
                           header-align="right">
          </el-table-column>
        </el-table>
      </div>
      <div class="alert-line"
           v-if="approveShow"></div>
      <approve-box v-if="approveShow"
                   :predictionGasId="predictionGasId"
                   :approveData="approveData"></approve-box>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../../http/api";
import exportApi from "../../../components/export/export";
import approveBox from './approveBox'
import { log } from 'mathjs';
export default {
  name: "dayGasPlanAndFeedback",
  mixins: [exportApi],
  data () {
    return {
      predictionGasId: '',
      roleCode: null,
      approveData: [],
      approveShow: false,
      approveShow: false,
      spanArr: [],// spanArr 是一个空的数组，用于存放每一行记录的合并数；
      pos: 0,// pos是spanArr的索引。
      pager: {
        currentPage: 1,
        pageSize: [10],
        totalPage: 0
      },
      pageSize: [10],
      dayRowData: {
        title: '',
        show: false,
        data: [
        ]
      },//单气源每行查看详情数据
      dayMultipleRowData: {
        title: '',
        show: false,
        data: [
        ],
        children: []
      },//多气源每行查看详情数据
      dayTableData: [],
      loading: false,
      timer: null,
      arr: []
    }
  },
  components: {
    approveBox
  },
  props: ['selectForm', 'time'],
  watch: {
    'selectForm.contractType': {
      handler () {
        this.pager.currentPage = 1
        this.getDayContractList()
      },
      deep: true,
      immediate: false
    },
    'selectForm.customerName': {
      handler () {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        this.timer = setTimeout(() => {
          this.pager.currentPage = 1
          this.getDayContractList()
        }, 1000)
      },
      deep: true,
      immediate: false
    },

    time: {
      handler () {
        this.pager.currentPage = 1
        this.getDayContractList()
      },
      deep: true,
      immediate: true
    },
    curCom () {
      this.getDayContractList()
    }
  },
  computed: {
    dayTime () {
      let day = this.$moment(this.time.day);
      let t = day.format('YYYY年MM月DD日')
      // let y = day.add(1, 'days').format('MM月DD日')
      let time = t
      return time
    },
    curCom () {
      return this.$store.getters.curCom
    }
  },
  created () {
    let userName = this.$store.getters.loginName
    let params = {
      userName,
    }
    api.gasPlanAndFeedback.getInfoByName(params).then(res => {
      // 1-单流程审核, 2-计划员审核, 3-调度中心审核, 4-气源贸易群审核
      let roles = ['计划员批复', '气源贸易群', '调度中心']
      res && res.roleNameList.forEach(item => {
        if (roles.includes(item.roleName)) {
          switch (item.roleName) {
            case '计划员批复':
              this.roleCode = 2
              break;
            case '气源贸易群':
              this.roleCode = 4
              break;
            case '调度中心':
              this.roleCode = 3
              break;

            default:
              break;
          }
        }
      })
    })
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    // 处理数据为0画-情况
    handleDate (value) {
      if (value === null) {
        return '-'
      } else if (value === 0) {
        return '0'
      } else {
        return value
      }
    },
    // 分页
    handlePagerChange (val) {
      this.pager.currentPage = val
      this.getDayContractList()
    },
    handleSizeChange (val) {
      this.pager.pageSize = [val]
      this.getDayContractList()
    },
    uuid () {
      function S4 () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    // 列表
    getDayContractList () {
      let curComInfo = this.$store.getters.curComInfo
      if (!curComInfo) {
        return
      }
      // if (!curComInfo.orgCode || !curComInfo.orgLevel) {
      //   return
      // }
      // 合同类型:1代输 2三方 3直销 4补充协议
      let params = {
        code: curComInfo.orgCode,
        orgLevel: curComInfo.orgLevel,
        contractType: this.selectForm.contractType + '',
        customerName: this.selectForm.customerName + '',
        pageSize: this.pager.pageSize[0],
        current: this.pager.currentPage,
        time: this.parseTime(this.time.day, '{yyyy}-{mm}-{dd}'),
      }
      this.dayTableData = []
      this.loading = true
      api.gasPlanAndFeedback.dayContractList(params).then(res => {
        this.loading = false
        if (res && res[0] && res[0].list && res[0].list.length > 0) {
          // 处理日最大瞬时流量
          res[0].list.forEach(item => {
            if (item.subDayPlanAllocateGasVOList && item.subDayPlanAllocateGasVOList.length > 0) {
              item.subDayPlanAllocateGasVOList[0].dayInstantaneousGasNum = item.dayInstantaneousGasNum
              item.subDayPlanAllocateGasVOList[1].dayInstantaneousGasNum = item.dayInstantaneousGasNum
              delete item.dayInstantaneousGasNum
            } else {
            }
          })
          this.pager.totalPage = res[0].total
          if (this.dayTableData.length > 0) {
            return
          }
          res[0].list.forEach((item) => {
            // smartReviewStatus为-1说明无子，null转-
            // subDayPlanAllocateGasVOList
            if (item.subDayPlanAllocateGasVOList === null) {
              (item.planPeriod === null) ? (item.planPeriod = '-') : item.planPeriod;
              (item.dayAllocateGasNum === null) ? (item.dayAllocateGasNum = '-') : item.dayAllocateGasNum;
              (item.fillGasNum === null) ? (item.fillGasNum = '-') : item.fillGasNum;
              (item.fillGasNumTotal === null) ? (item.fillGasNumTotal = '-') : item.fillGasNumTotal;
              (item.planPeriod === null) ? (item.planPeriod = '-') : item.planPeriod;
              (item.dayInstantaneousGasNum === null) ? (item.dayInstantaneousGasNum = '-') : item.dayInstantaneousGasNum;
            }
            // 处理 planPeriod 计划期数据格式
            if (item.planPeriod != '-' && item.planPeriod != null) {
              item.planPeriod = item.planPeriod.split('-')[0] + ' ~ ' + item.planPeriod.split('-')[1]
            }
            item.id = this.uuid()
            item.isChild = false
            item.hasChild = false
            item.customerName = item.customerName + '';
            item.previousValue = item.reviewGasNum
            if (item.subDayPlanAllocateGasVOList && item.subDayPlanAllocateGasVOList.length > 0) {
              // 多气源集合
              item.hasChild = true
              item.subDayPlanAllocateGasVOList.forEach((val, i) => {
                val.parentId = item.preGasId
                val.id = this.uuid()
                val.isChild = true
                val.childIndex = i
                val.isBigCustomer = item.isBigCustomer
                val.previousValue = val.reviewGasNum
                val.smartReviewStatus = item.smartReviewStatus
                val.customerName = val.gasName + '';
                (val.planPeriod === null) ? (val.planPeriod = '-') : val.planPeriod;
                (val.dayAllocateGasNum === null) ? (val.dayAllocateGasNum = '-') : val.dayAllocateGasNum;
                (val.fillGasNum === null) ? (val.fillGasNum = '-') : val.fillGasNum;
                (val.fillGasNumTotal === null) ? (val.fillGasNumTotal = '-') : val.fillGasNumTotal;
                (val.planPeriod === null) ? (val.planPeriod = '-') : val.planPeriod;
                (val.dayInstantaneousGasNum === null) ? (val.dayInstantaneousGasNum = '-') : val.dayInstantaneousGasNum;
                // 处理 planPeriod 计划期数据格式
                if (val.planPeriod != '-' && val.planPeriod != null) {
                  val.planPeriod = val.planPeriod.split('-')[0] + ' ~ ' + val.planPeriod.split('-')[1]
                }
              })
              item.children = item.subDayPlanAllocateGasVOList
            }
            this.dayTableData.push(item)
          })
          // this.getSpanArr(this.dayTableData)

        }
      })
    },
    //详情
    checkDetail (value) {
      if (value.dayAllocateGasNum == '-' && value.fillGasNum == '-' && value.fillGasNumTotal == '-') {
        return
      }
      if (value.isBigCustomer === '1') {
        this.approveShow = true
      } else if (value.isBigCustomer === '0') {
        this.approveShow = false
      }
      // smartReviewStatus 审核状态:0未审核，1已审核，2计划员审核完，3调度中心，4气源贸易群审核中
      // let month = (new Date(this.time.day).getMonth() + 1) < 10 ? '0' + (new Date(this.time.day).getMonth() + 1) : (new Date(this.time.day).getMonth() + 1)
      // let day = new Date(this.time.day).getDate() < 10 ? '0' + new Date(this.time.day).getDate() : new Date(this.time.day).getDate()
      // let time = ` ${month}/${day}`
      let time = value.planPeriod
      let title = ''
      let id = null
      // 通过parentId找到对应的父标题
      if (value.parentId) {
        this.dayTableData.forEach(item => {
          if (item.preGasId == value.parentId) {
            id = item.preGasId
            title = item.customerName + time + '上报详情'
          }
        })
        this.dayMultipleRowData.title = title
        this.dayMultipleRowData.show = false
        this.dayRowData.show = false
      } else {
        title = value.customerName + time + '上报详情'
        this.dayRowData.title = title
        this.dayMultipleRowData.show = false
        this.dayRowData.show = false
        id = value.preGasId
      }

      let params = {
        predictionGasId: id
      }
      this.approveData = []
      api.gasPlanAndFeedback.dayContractGetDetail(params).then(res => {

        // if (value.parentId) {
        //   this.dayMultipleRowData.show = true
        //   this.dayRowData.show = false
        // } else {
        //   this.dayMultipleRowData.show = false
        //   this.dayRowData.show = true
        // }
        this.predictionGasId = id
        this.dayRowData.data = []
        this.dayMultipleRowData.data = []
        if (!res) {
          return
        }
        // 审批流程 predictionGasFlowHistoryVOS
        if (res && res[0].predictionGasFlowHistoryVOS && res[0].predictionGasFlowHistoryVOS.length > 0) {
          let HistoryList = [{
            auditLoginName: '',
            auditName: '',
            auditRole: '4',
            auditStatus: '0',
            auditTime: '',
            reviewTotalGasUse: '',
          }, {
            auditLoginName: '',
            auditName: '',
            auditRole: '3',
            auditStatus: '0',
            auditTime: '',
            reviewTotalGasUse: '',
          }, {
            auditLoginName: '',
            auditName: '',
            auditRole: '2',
            auditStatus: '0',
            auditTime: '',
            reviewTotalGasUse: '',
          }]
          //处理初始值
          let initArr = {}
          let resultArr = []
          res[0].predictionGasFlowHistoryVOS.forEach(item => {
            if (item.auditRole === '0') {
              initArr = item
            } else {
              resultArr.push(item)
            }
          })
          let length = resultArr.length
          switch (length) {
            case 1:
              // 0
              if (resultArr[0].auditRole == '3') {
                HistoryList[1].auditLoginName = resultArr[0].auditLoginName
                HistoryList[1].auditName = resultArr[0].auditName
                HistoryList[1].auditRole = resultArr[0].auditRole
                HistoryList[1].auditStatus = resultArr[0].auditStatus
                HistoryList[1].auditTime = resultArr[0].auditTime
                HistoryList[1].reviewTotalGasUse = resultArr[0].reviewTotalGasUse
                HistoryList[1].dayGasPlanAuditDetailVOList = resultArr[0].dayGasPlanAuditDetailVOList
              } else if (resultArr[0].auditRole == '4') {
                HistoryList[0].dayGasPlanAuditDetailVOList = resultArr[0].dayGasPlanAuditDetailVOList
                HistoryList[0].auditLoginName = resultArr[0].auditLoginName
                HistoryList[0].auditName = resultArr[0].auditName
                HistoryList[0].auditRole = resultArr[0].auditRole
                HistoryList[0].auditStatus = resultArr[0].auditStatus
                HistoryList[0].auditTime = resultArr[0].auditTime
                HistoryList[0].reviewTotalGasUse = resultArr[0].reviewTotalGasUse
              }
              break;
            case 2:
              resultArr.forEach(item => {
                if (item.auditRole == '3') {
                  HistoryList[1].auditLoginName = item.auditLoginName
                  HistoryList[1].auditName = item.auditName
                  HistoryList[1].auditRole = item.auditRole
                  HistoryList[1].auditStatus = item.auditStatus
                  HistoryList[1].auditTime = item.auditTime
                  HistoryList[1].reviewTotalGasUse = item.reviewTotalGasUse
                  HistoryList[1].dayGasPlanAuditDetailVOList = item.dayGasPlanAuditDetailVOList
                } else if (item.auditRole == '4') {
                  HistoryList[0].dayGasPlanAuditDetailVOList = item.dayGasPlanAuditDetailVOList
                  HistoryList[0].auditLoginName = item.auditLoginName
                  HistoryList[0].auditName = item.auditName
                  HistoryList[0].auditRole = item.auditRole
                  HistoryList[0].auditStatus = item.auditStatus
                  HistoryList[0].auditTime = item.auditTime
                  HistoryList[0].reviewTotalGasUse = item.reviewTotalGasUse
                }
              })
              break;
            case 3:
              resultArr.forEach(item => {
                if (item.auditRole == '3') {
                  HistoryList[1].auditLoginName = item.auditLoginName
                  HistoryList[1].auditName = item.auditName
                  HistoryList[1].auditRole = item.auditRole
                  HistoryList[1].auditStatus = item.auditStatus
                  HistoryList[1].auditTime = item.auditTime
                  HistoryList[1].reviewTotalGasUse = item.reviewTotalGasUse
                  HistoryList[1].dayGasPlanAuditDetailVOList = item.dayGasPlanAuditDetailVOList
                } else if (item.auditRole == '4') {
                  HistoryList[0].dayGasPlanAuditDetailVOList = item.dayGasPlanAuditDetailVOList
                  HistoryList[0].auditLoginName = item.auditLoginName
                  HistoryList[0].auditName = item.auditName
                  HistoryList[0].auditRole = item.auditRole
                  HistoryList[0].auditStatus = item.auditStatus
                  HistoryList[0].auditTime = item.auditTime
                  HistoryList[0].reviewTotalGasUse = item.reviewTotalGasUse
                } else if (item.auditRole == '2') {
                  HistoryList[2].dayGasPlanAuditDetailVOList = item.dayGasPlanAuditDetailVOList
                  HistoryList[2].auditLoginName = item.auditLoginName
                  HistoryList[2].auditName = item.auditName
                  HistoryList[2].auditRole = item.auditRole
                  HistoryList[2].auditStatus = item.auditStatus
                  HistoryList[2].auditTime = item.auditTime
                  HistoryList[2].reviewTotalGasUse = item.reviewTotalGasUse
                }
              })
              break;

            default:
              break;
          }
          HistoryList.forEach(item => {
            if (item.reviewTotalGasUse || item.reviewTotalGasUse === 0) {
              item.reviewTotalGasUse = item.reviewTotalGasUse + '方'
            }
          })
          HistoryList.push(initArr)
          this.approveData = HistoryList
        } else {
          // 无审批流程
          // this.approveShow = false
          // this.approveData = []
        }

        // 操作记录 operateLogVOS 有几项就是几次操作
        if (res && res[0] && res[0].operateLogVOS) {
          this.dayMultipleRowData.data = []
          this.dayRowData.data = []
          res[0].operateLogVOS.forEach((item, i) => {
            console.log(item.operateUserPhone);
            // item.gasPredictionAuditFlowMsg 操作日志
            // item.gasPredictionAuditFlowMsg.multipleGasDetailAuditFlowMsgs多气源操作记录
            // 判断是否是多气源
            if (item.gasPredictionAuditFlowMsg.multipleGasDetailAuditFlowMsgs && item.gasPredictionAuditFlowMsg.multipleGasDetailAuditFlowMsgs.length > 0) {
              this.dayMultipleRowData.title = title
              let obj = {}
              obj.operateTime = item.operateTime
              obj.times = res[0].operateLogVOS.length - i//日指定
              // obj.dayGasNum = item.gasPredictionAuditFlowMsg.dayGasNum || '-'//日指定
              // obj.fillGasNum = item.gasPredictionAuditFlowMsg.fillGasNum || '-'//补提量
              // obj.changeGasReason = item.gasPredictionAuditFlowMsg.changeGasReason || '-'//变更预报气量原因
              // obj.reviewGasNum = item.gasPredictionAuditFlowMsg.reviewGasNum || '-'//批复量
              obj.dayGasNum = this.handleDate(item.gasPredictionAuditFlowMsg.dayGasNum)//日指定
              obj.fillGasNum = this.handleDate(item.gasPredictionAuditFlowMsg.fillGasNum) //补提量
              obj.changeGasReason = this.handleDate(item.gasPredictionAuditFlowMsg.changeGasReason)//变更预报气量原因
              obj.reviewGasNum = this.handleDate(item.gasPredictionAuditFlowMsg.reviewGasNum)//批复量
              obj.operateUserPhone = item.operateUserPhone
              obj.children = []
              if (item.gasPredictionAuditFlowMsg.multipleGasDetailAuditFlowMsgs && item.gasPredictionAuditFlowMsg.multipleGasDetailAuditFlowMsgs.length > 0) {
                item.gasPredictionAuditFlowMsg.multipleGasDetailAuditFlowMsgs.forEach(item => {
                  let child = {}
                  child.m_gasName = this.handleDate(item.gasName) //名字
                  child.m_dayGasNum = this.handleDate(item.dayGasNum)//日指定
                  child.m_fillGasNum = this.handleDate(item.fillGasNum)//补提量
                  child.m_reviewGasNum = this.handleDate(item.reviewGasNum)//批复量
                  child.m_changeGasReason = ''//变更原因
                  child.m_operateUserPhone = ''
                  obj.children.push(child)
                })
              }

              this.dayMultipleRowData.data.push(obj)
            }
            if (item.gasPredictionAuditFlowMsg.multipleGasDetailAuditFlowMsgs === null) {
              this.dayMultipleRowData.title = title

              let obj = {}
              obj.operateTime = this.handleDate(item.operateTime)
              obj.times = res[0].operateLogVOS.length - i
              obj.dayGasNum = this.handleDate(item.gasPredictionAuditFlowMsg.dayGasNum)//日指定
              obj.fillGasNum = this.handleDate(item.gasPredictionAuditFlowMsg.fillGasNum) //补提量
              obj.changeGasReason = this.handleDate(item.gasPredictionAuditFlowMsg.changeGasReason) //变更预报气量原因
              obj.reviewGasNum = this.handleDate(item.gasPredictionAuditFlowMsg.reviewGasNum) //批复量
              // this.dayRowData.data.push(obj)
              obj.operateUserPhone = item.operateUserPhone
              this.dayMultipleRowData.data.push(obj)

            }
          })
          this.dayMultipleRowData.data.length > 0 ? (this.dayMultipleRowData.show = true) : ''
          setTimeout(() => {
            let times = document.querySelectorAll('.multipleTable tbody .el-table__expand-column')
            let length = times.length
            for (let i = 0; i < length; i++) {
              times[i].innerHTML = (length - i)
            }
          }, 500);
        }


      })
    },
    // 确定批复
    confirmApproval (value) {
      let isEmpty = false
      if (value.isChild) {
        // previousValue
        // reviewGasNum
        this.dayTableData.forEach(item => {
          if (item.preGasId === value.parentId) {
            for (let i = 0; i < item.subDayPlanAllocateGasVOList.length; i++) {
              if ((item.subDayPlanAllocateGasVOList[i].reviewGasNum !== 0) && !item.subDayPlanAllocateGasVOList[i].reviewGasNum) {
                this.$message({
                  message: '反馈气量不能为空',
                  type: 'warning'
                });
                isEmpty = true
                break
              }
            }
          }
        })
      }
      if (!value.isChild && !value.reviewGasNum) {
        this.$message({
          message: '反馈气量不能为空',
          type: 'warning'
        });
        return
      }
      if (isEmpty) {
        return
      }
      // 判断时候 贸易群和调度中心批复的量比计划员申请的大 
      // 
      // if (value.isBigCustomer === '1') {
      //   if (this.roleCode == 3 || this.roleCode == 4) {
      //     if (value.isChild) {
      //       let tip = ''
      //       this.dayTableData.forEach(item => {
      //         if (item.preGasId === value.parentId) {
      //           for (let i = 0; i < item.subDayPlanAllocateGasVOList.length; i++) {
      //             if (item.subDayPlanAllocateGasVOList[i].previousValue === null) {
      //               tip = ''
      //             } else if (item.subDayPlanAllocateGasVOList[i].reviewGasNum > item.subDayPlanAllocateGasVOList[i].previousValue) {
      //               tip += `${item.subDayPlanAllocateGasVOList[i].customerName} 批复上限为${item.subDayPlanAllocateGasVOList[i].previousValue}方。`
      //             }
      //           }
      //         }
      //       })
      //       let s = ''
      //       if (tip !== '') {
      //         if (tip.split('。').length >= 2) {
      //           let s1 = tip.split('。')[0]
      //           let s2 = tip.split('。')[1]
      //           s = `<p style="margin-bottom:4px;">${s1}</p><p>${s2}</p>`
      //         } else {
      //           let s1 = tip.split('。')[0]
      //           s = `<p>${s1}</p>`
      //         }
      //         this.$message({
      //           showClose: true,
      //           dangerouslyUseHTMLString: true,
      //           message: s,
      //           duration: 4000,
      //           type: 'warning',
      //         });
      //         return
      //       }

      //     } else {
      //       if (value.previousValue === null) { } else {
      //         if (value.reviewGasNum > value.previousValue) {
      //           this.$message({
      //             showClose: true,
      //             duration: 4000,
      //             message: `批复上限为${value.previousValue}`,
      //             type: 'warning'
      //           });
      //           return
      //         }
      //       }

      //     }
      //   }
      // } else if (value.isBigCustomer === '0') {

      // }




      let loginName = this.$store.getters.loginName
      let params = {
        auditLoginName: loginName,//审核人登录名
        auditName: loginName,//审核人姓名
        auditRole: '',//审核人角色: 1-单流程审核, 2-计划员审核, 3-调度中心审核, 4-气源贸易群审核
        mark: '',//mark： 1 --默认, 2 -- 需贸易区审核
        operateUserId: this.$store.getters.userInfo.userId,//操作人
        predictionGasDetailAudits: [
        ],//预报气量明细集合
        predictionGasId: '',//预报气量Id
        reviewGasNum: '',//批复量
      }
      let hasWraning = false
      let parentData = null

      // contractType 为null无合同，不走审批
      if (value.contractType === null) {
        if (value.parentId) {
          this.dayTableData.forEach(item => {
            // 
            if (item.preGasId === value.parentId) {
              params.predictionGasId = item.preGasId
              parentData = item
            }
          })
        } else {
          parentData = value
        }

        params.predictionGasId = value.preGasId
        params.reviewGasNum = value.reviewGasNum
        params.mark = '1'
        params.auditRole = this.roleCode + ''
        hasWraning = false
      } else {
        if (value.parentId) {
          this.dayTableData.forEach(item => {
            // 
            if (item.preGasId === value.parentId) {
              params.predictionGasId = item.preGasId
              parentData = item
              //item为原值,原始值和填写值比较
              // dayExtractionMax
              // reviewGasNum
              item.subDayPlanAllocateGasVOList.forEach(v => {
                // 用户提取值大于最大提取值
                if (v.reviewGasNum > v.dayExtractionMax) {
                  hasWraning = true
                } else {
                }
                let o = {
                  predictionGasDetailId: v.preGasDetailId / 1,
                  reviewGasNum: v.reviewGasNum / 1,
                }
                params.predictionGasDetailAudits.push(o)
              })
            }
          })
        } else {
          parentData = value
          params.predictionGasId = value.preGasId
          params.predictionGasDetailAudits = []
          params.reviewGasNum = value.reviewGasNum
          // 判断是否超过最大提取量
          // value.dayExtractionMax   value.reviewGasNum
          if (value.reviewGasNum > value.dayExtractionMax) {
            // 有警告提示的框
            hasWraning = true
          } else {
            // 无警告提示框
            hasWraning = false
          }
        }
        // 判断气量是否需要审批
        // 根据身份判断
        if (this.roleCode == 3 || this.roleCode == 4) {
          if (parentData.smartReviewStatus == 2 || parentData.smartReviewStatus == 3 || parentData.smartReviewStatus == 4) {
            params.mark = '2'
          }
        } else if (this.roleCode == 2) {
          if (hasWraning) {
            params.mark = '2'
          } else {
            params.mark = '1'
          }
        }
        params.auditRole = this.roleCode + ''
        if (params.mark == '1') {
          params.auditRole = '1'
        }

      }
      const h = this.$createElement;
      let html = []
      if (hasWraning) {
        html = [
          // h('p', { attrs: { id: 'warningMsg' } }, `由于计划在合同偏差外，需要气源贸易群、调度中心进行审批`),
          h('p', { style: 'fontSize:14px;color:#303133;fontWeight:500;lineHeight:20px;marginTop:10px;' }, `${parentData.customerName}`),
        ]
      } else {
        html = [
          h('p', { style: 'fontSize:14px;color:#303133;fontWeight:500;lineHeight:20px;marginTop:30px;marginBottom:10px' }, `${parentData.customerName}`),
        ]
      }
      if (value.isBigCustomer === '1') {
        params.mark = '2'
      } else if (value.isBigCustomer === '0') {
        params.mark = '1'
      }
      params.auditRole = this.roleCode + ''
      if (parentData.subDayPlanAllocateGasVOList && parentData.subDayPlanAllocateGasVOList.length > 0) {
        let oneName = parentData.subDayPlanAllocateGasVOList[0].gasName
        let oneTime = parentData.subDayPlanAllocateGasVOList[0].planPeriod
        let oneReview = parentData.subDayPlanAllocateGasVOList[0].reviewGasNum
        let twoName = parentData.subDayPlanAllocateGasVOList[1].gasName
        let twoTime = parentData.subDayPlanAllocateGasVOList[1].planPeriod
        let twoReview = parentData.subDayPlanAllocateGasVOList[1].reviewGasNum
        // 多气源样式,
        html.push(
          h('div', null, [
            h('div', null, [
              h('p', { attrs: { class: 'msgbox' } }, [h('div', { attrs: { class: 'subTitle' } }, `${oneName}`), h('div', { attrs: { class: 'subInfo' } }, [
                h('span', { attrs: { class: 'subTime' } }, `${oneTime}`),
                h('div', null, [h('span', { attrs: { class: 'subValueTxt' } }, '批复量为 '), h('span', { attrs: { class: 'subValue' } }, `${oneReview}(方)`)]),
              ])]),

            ]),
            h('div', null, [
              h('p', { attrs: { class: 'msgbox' } }, [h('div', { attrs: { class: 'subTitle' } }, `${twoName}`), h('div', { attrs: { class: 'subInfo' } }, [
                h('span', { attrs: { class: 'subTime' } }, `${twoTime}`),
                h('div', null, [h('span', { attrs: { class: 'subValueTxt' } }, '批复量为 '), h('span', { attrs: { class: 'subValue' } }, `${twoReview}(方)`)]),
              ])]),

            ]),
          ]))

      } else {
        // 单气源
        html.push(h('p', { style: 'fontWeight:400;fontSize: 14px;color: #303133;lineHeight: 21px;paddingRight: 20px;marginBottom:10px;' }, `${value.planPeriod}`),
          h('p', null, [
            h('span', { attrs: { class: 'subValueTxt' } }, '批复量为 '),
            h('span', { attrs: { class: 'subValue' } }, `${value.reviewGasNum}(方)`),
          ]))
      }
      setTimeout(() => {
        // 详情弹框盒子
        let outsideBox = document.querySelector('.el-message-box')
        outsideBox.style.padding = '20px'
        outsideBox.style.width = '510px'

        let headrBox = document.querySelector('.el-message-box__header')
        headrBox.style.display = 'flex'
        headrBox.style.height = '25px'
        headrBox.style.lineHeight = '25px'
        headrBox.style.alignItem = 'center'
        headrBox.style.justifyContent = 'space-between'
        let headrTitle = document.querySelector('.el-message-box__header .el-message-box__title')
        headrTitle.style.lineHeight = '25px'
        headrTitle.style.fontWeight = '500'
        let closeBtn = document.querySelector('.el-message-box__headerbtn')
        closeBtn.style.position = 'static'
        //内容box
        let contentBox = document.querySelector('.el-message-box__content')
        contentBox.style.padding = '0'
        // 标题

        let title = document.querySelector('.el-message-box__header')
        title.style.padding = '0'
        let btns = document.querySelector('.el-message-box__btns')
        btns.style.padding = '0'
        btns.style.marginTop = '28px'
        let btn = document.querySelectorAll('.el-message-box__btns button')
        btn[0].style.width = '58px'
        btn[0].style.height = '32px'
        btn[0].style.borderRadius = '16px'
        btn[0].style.backgroundColor = '#F5F7FA'
        btn[1].style.width = '58px'
        btn[1].style.height = '32px'
        btn[1].style.borderRadius = '16px'
        btn[1].style.backgroundColor = '#47A87D'
        btn[1].style.border = 'none'
      }, 50);
      let times = 1
      this.$msgbox({
        title: '日指定量批复确认',
        message: h('div', null, html),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            times++
            if (times === 2) {
              api.gasPlanAndFeedback.dayContractExamine(params).then(res => {
                this.getDayContractList()
                done();
              }).catch((err) => {
                this.$message({
                  message: err.resultMessage,
                  type: 'error'
                });
              })
            }

          } else {
            done();
          }
        }
      });

    },
    // 导出
    exportData () {
      let curComInfo = this.$store.getters.curComInfo
      // 合同类型:1代输 2三方 3直销 4补充协议
      // let params = {
      //   compCode: curComInfo.orgCode + '',
      //   orgLevel: curComInfo.orgLevel + '',

      let params = {
        code: curComInfo.orgCode + '',//公司编码
        contractType: this.selectForm.contractType + '',//合同类型
        customerName: this.selectForm.customerName + '',//客户名称
        orgLevel: curComInfo.orgLevel + '',//3管理实体，4法人公司
        time: this.parseTime(this.time.day, '{yyyy}-{mm}-{dd}') + '',//时间
      }
      api.gasPlanAndFeedback.dayContractExport(params).then(res => {

        this.download(res, 'xlsx', `${this.parseTime(this.time.day, '{yyyy}-{mm}-{dd}')}用气计划`)
        // let blob = new Blob([res])
        // let downloadElement = document.createElement('a');
        // let href = window.URL.createObjectURL(blob);
        // downloadElement.href = href;
        // downloadElement.download = '用气历史.xlsx'; //下载后文件名
        // document.body.appendChild(downloadElement);
        // downloadElement.click(); //点击下载
        // document.body.removeChild(downloadElement); //下载完成移除元素
        // window.URL.revokeObjectURL(href); //释放掉blob对象
      })
    },
    parseTime (time, cFormat) {
      if (arguments.length === 0) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string')) {
          if ((/^[0-9]+$/.test(time))) {
            time = parseInt(time)
          } else {
            time = time.replace(new RegExp(/-/gm), '/')
          }
        }

        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        return value.toString().padStart(2, '0')
      })
      return time_str
    },

  }
}
</script>
<style scoped lang="scss">
.alert-line {
  height: 1px;
  background-color: #dcdfe6;
  transform: translateY(18px);
  margin-left: -20px;
  margin-right: -20px;
}
.dayTime {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}
.my-custom-table /deep/ thead tr th div {
  font-size: 14px;
  font-weight: bold;
  color: #606266;
}
.my-custom-table /deep/ thead tr th {
  height: 60px;
  padding: 0;
  box-sizing: border-box;
}
.oneLine .singPlan .sureHandle {
  margin-right: -18px;
}
.subInfo {
  margin-bottom: 15px;
  display: flex;
  height: 21px;
  align-items: center;
  margin-bottom: 15px;
}
.waiting {
  position: absolute;
  right: 24px !important;
}
.subTitle {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 20px;
  color: #303133;
}
.subTime {
  font-weight: 400;
  font-size: 14px;
  color: #303133;
  line-height: 21px;
  padding-right: 20px;
}
#subTime {
  font-weight: 400;
  font-size: 14px;
  color: #303133;
  line-height: 21px;
  padding-right: 20px;
}
.subValueTxt {
  font-weight: 400;
  font-size: 14px;
  color: #303133;
  line-height: 21px;
}
.subValue {
  color: rgb(64, 158, 255);
  margin-left: 6px;
}
.card-wrapper {
  border-radius: 0 0 4px 4px;
}
.my-custom-table /deep/ thead tr th:nth-of-type(1) {
  padding-left: 16px !important;
}
.my-custom-table /deep/ thead tr th:nth-of-type(1) .cell {
  padding-left: 74px !important;
}
.checkDetail.checkDetailBox.child {
  right: 30px;
}
.img {
  position: absolute;
  right: 27px;
  top: 17px;
  z-index: 1;
  vertical-align: middle;
  margin-right: -21px;
}
.singPlan /deep/ .input.el-input.el-input--mini {
  width: 132px;
}
.sure-plan /deep/ .input.el-input.el-input--mini {
  width: 132px;
}
.multipleTable /deep/ table tr > td.el-table__expanded-cell {
  border: none !important;
  padding: 0 !important;
}
.singleTableHeader /deep/ th,
.multipleTableHeader /deep/ th {
  background-color: #f5f7fa !important;
}
.innerTable /deep/ table tr td {
  border: none !important;
}
.singleTableHeader,
.multipleTableHeader {
  border-radius: 8px !important;
}
.multipleTableHeader /deep/ .el-table__cell.el-table__expanded-cell {
  padding: 0 !important;
}
.singleTableHeader /deep/ .el-table__cell.el-table__expanded-cell {
  padding: 0 !important;
}
.tableContent {
  box-sizing: border-box;
  padding-bottom: 8px;
}
.gas-dialog /deep/ .el-dialog__header .el-dialog__title {
  font-weight: 500;
  font-size: 18px;
  color: #303133 !important;
}
.gas-dialog /deep/ .el-dialog__header {
  border-bottom: 1px solid #dcdfe6;
}
.gas-dialog /deep/ .el-dialog__header {
  height: 64px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  box-sizing: border-box;
  font-size: 18px;
  color: #303133;
}

.top-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}
.banner-card-wrapper {
  border-radius: 0px 0px 4px 4px !important;
  margin-top: 0 !important;
  margin-left: 20px;
  position: static;
  overflow: scroll !important;
}
.top-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}
.checkDetail.child {
  right: 16px;
}

.sureHandle {
  right: 7px !important;
}
#warningMsg {
  font-size: 14px;
  height: 35px;
  line-height: 35px;
  margin-top: 20px;
  color: #f56c6c;
  background: #fef0f0;
  margin-left: -20px;
  width: 529px;
  padding-left: 21px;
  margin-bottom: 20px;
}
.twolineEmpty {
  width: 100%;
  text-align: center;
}
.twolineEmpty .twoLine .sure-plan {
  display: flex;
  justify-content: center;
}
.twoLine {
  padding-left: -75px;
}
.oneLine > div {
  display: flex;
}
.checkWaiting {
  right: 47px !important;
  color: #409eff;
}
.twoDoneFeedback {
  position: absolute;
  right: 44px;
  top: 40px;
  z-index: 99;
}
.singPlan {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 5px;
}
.pager {
  margin-top: 20px;
}
.msgbox {
  color: #303133;
  line-height: 20px;
  margin-right: 20px;
  margin-top: 10px;
  font-weight: 500;
}
.msgbox > div:nth-of-type(2) {
  display: flex;
  align-items: center;
}
.info {
  margin-bottom: 15px;
}
.title {
  margin-right: 20px;
}
.multipleTable /deep/ td .el-table__header-wrapper,
.multipleTable /deep/ .expanded .cell i {
  display: none;
}
.multipleTable /deep/ td table td {
  background-color: #f5f7fa;
}
.multipleTable
  /deep/
  .el-table__body-wrapper
  > table
  > tbody
  > tr:nth-of-type(2n)
  > td {
  background-color: #f5f7fa !important;
}
.innerTable /deep/ .el-table__body-wrapper {
  background-color: #f5f7fa !important;
}
.oneLine .doneFeedback {
  font-size: 14px;
  color: #acacae;
  position: absolute;
  right: 26px;
}
.oneLine .doneFeedbackNum {
  font-size: 14px;
  color: #303133;
  display: inline-block;
  width: 132px;
  text-align: center;
  padding-left: 12px;
}
.twoLine .doneFeedback {
  font-size: 14px;
  color: #acacae;
  position: absolute;
  right: 26px;
}
.twoLine .doneFeedbackNum {
  font-size: 14px;
  color: #303133;
  display: inline-block;
  width: 132px;
  text-align: center;
  padding-left: 12px;
  position: absolute;
  // top: 40px;
  // z-index: 9999;
}
.my-custom-table /deep/ .el-table__expand-icon.el-table__expand-icon--expanded {
  display: none;
}
.my-custom-table /deep/ input {
  text-align: center;
  width: 132px;
  border-radius: 16px;
}
.my-custom-table /deep/ .el-table__row--level-1 .el-table_1_column_6 > .cell {
  display: flex;
  padding-left: 30px !important;
}
.my-custom-table /deep/ .el-table__row--level-1 > td:nth-of-type(1) {
  padding-left: 66px !important;
  box-sizing: border-box;
}
.my-custom-table
  /deep/
  .el-table__row--level-1
  > td:nth-of-type(1)
  > .cell
  > span {
  display: none;
}
.my-custom-table /deep/ tr td:nth-of-type(1) .cell > div {
  display: flex;
  align-items: center;
}
.my-custom-table
  /deep/
  tr
  td:nth-of-type(1)
  .cell
  .el-table__expand-icon.el-table__expand-icon--expanded {
  display: none;
}
.my-custom-table
  /deep/
  .el-table__row.el-table__row--level-1
  td:nth-of-type(7)
  > .cell {
  // display: none;
  height: 48px;
  line-height: 48px;
}
.my-custom-table
  /deep/
  .el-table__row.expanded.el-table__row--level-0
  td:nth-of-type(7)
  > .cell {
  opacity: 0;
}
.child {
  position: absolute;
  top: 0;
  right: 26px;
  height: 104px;
  line-height: 104px;
  z-index: 99;
}
.my-custom-table /deep/ .el-table__row.el-table__row--level-1 {
  background-color: #f5f7fa;
}

.two {
  padding-left: 75px;
}

.my-custom-table
  /deep/
  .el-table__row--level-0
  + .el-table__row--level-1
  + .el-table__row--level-1
  td {
  border-top: none !important;
}
.my-custom-table /deep/ .el-table__row--level-0 + .el-table__row--level-1 td {
  border-bottom: none !important;
}

.totalTips {
  color: #f56c6c;
}
.fillGasNumTotal {
  text-align: right;
}
.twoFillGasNumTotal {
  width: 100%;
}

.custom-tab-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 20px;
  margin-left: 0;
  color: #fff;
  background-color: #567db9;
  border-color: #567db9;
  padding: 0;
}
.custom-tab-button-active {
  color: #fff;
  background-color: #0fb2ab;
  border-color: #0fb2ab;
}
.custom-datepicker {
  background: #567db9;
  border-radius: 20px;
  border: none;
  color: #ffffff !important;
  margin-right: 20px;
}
.demo-form-inline {
  /deep/ .el-form-item__label {
    color: #ffffff;
    font-size: 14px;
  }

  /deep/ .gas-el-select .el-input__suffix {
    border-left: none;
    right: 12px;
  }
}
.gas-page-com-wrapper {
  width: 220px;
  height: 40px;
  background: #567db9;
  opacity: 1;
  border-radius: 24px;
  float: right;
  margin-right: 20px;
  overflow: hidden;
}
.banner-title-wrapper {
  width: 100%;
  margin-bottom: 18px;
}
.banner-title-item-l {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-top: 18px;
  margin-left: 17px;
}
.banner-table-wrapper {
  padding: 0 23px 20px 17px;
  box-sizing: border-box;
}
.empty-wrapper {
  height: 436px;
  padding-top: 43px;
  box-sizing: border-box;
  p {
    height: 24px;
    line-height: 23px;
    padding: 0;
    margin: 0;
  }
}
.contractType {
  display: inline-block;
  width: 48px;
  min-width: 48px;
  height: 24px;
  line-height: 23px;
  border-radius: 14px;
  text-align: center;
  font-size: 14px;
  margin-right: 20px;
}
.twoLine .sure-plan {
  padding-left: 6px;
}
.sure-plan {
  display: flex;
  align-items: center;
}
.longCustomerName {
  display: inline-block;
  width: 17em;
  line-height: 23px;
  height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.contractName {
  min-width: 263px;
}
.longcontractName {
  display: inline-block;
  width: 15em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.input /deep/ input {
  height: 32px !important;
  width: 132px !important;
  text-align: center;
}
.sale-proxy {
  border: 1px solid #f56c6c;
  background: #fef0f0;
  color: #f56c6c;
}
.sale-direct {
  border: 1px solid #409eff;
  color: #409eff;
  background-color: #ecf5ff;
}
.sale-third {
  border: 1px solid #e6a23c;
  background-color: #fcf6ec;
  color: #e6a23c;
}
.customerName {
  font-size: 14px;
  color: #303133;
}
.my-custom-table {
  border-radius: 8px 8px 0px 0px;
  font-size: 14px;
  color: #303133;
  /deep/ .el-table__empty-block {
    width: auto !important;
  }
  /deep/ .my-custom-table-header th {
    background: #f5f7fa !important;
    color: #606266;
    font-weight: 500;
  }
  /deep/ .my-custom-table-header th:first-child {
    padding: 0 10px;
  }
  /deep/ .el-table__fixed {
    height: auto !important;
    bottom: 10px;
  }
  /deep/ ::-webkit-scrollbar {
    height: 10px;
  }
}
.checkDetail {
  text-align: center;
  color: #409eff;
  cursor: pointer;
}
.checkDetailing {
  color: #409eff;
}
.banner-title-item-l {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
}
.banner-title-item-l span {
  display: inline-block;
  vertical-align: middle;
}

.custom-btn {
  width: 79px;
  height: 32px;
  margin-right: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa !important;
  border: 1px solid #dcdfe6;
  color: #303133;
}
.custom-btn:hover {
  background: #47a87d !important;
  border-color: #47a87d !important;
  color: #fff !important;
}
.custom-button /deep/ span,
.custom-button /deep/.el-icon-upload2 {
  color: #fff;
}
.bold {
  font-weight: 600;
}
</style>